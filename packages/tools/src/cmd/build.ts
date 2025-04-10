import { Command } from '@commander-js/extra-typings'
import { validateArg } from '@jahands/cli-tools'
import * as esbuild from 'esbuild'
import { match } from 'ts-pattern'

import { z } from '@repo/zod'

import { isOrangeJsProject, shouldRemoveSourcemapsBeforeDeploy } from '../package'
import { timeFn } from '../time'

export const buildCmd = new Command('build').description('Build Workers/etc.')

buildCmd
	.command('wrangler')
	.description('Build a Workers project with Wrangler')
	.option(
		'--no-output',
		`Don't output to ./dist directory (useful for frameworks with their own build.) `
	)
	.option(
		'--no-minify',
		`Don't use --minify flag (useful for frameworks that already minify the output))`
	)
	.action(async ({ output, minify }) => {
		const cmd: string[] = ['wrangler', 'deploy', '--dry-run']

		if (minify) {
			cmd.push('--minify')
		}
		if (output) {
			cmd.push('--outdir', './dist')
		}

		await timeFn('wrangler build', () => $`${cmd}`.verbose())()
	})

buildCmd
	.command('bun-compile')
	.description('build a bun app in compiled mode')

	.argument('<entrypoint>', 'e.g. ./src/index.ts')
	.argument('<out-file>', 'e.g. ./dist/cronjobs')
	.option('--version <version>', 'Release version of the app', validateArg(z.string()))

	.action(async (entrypoint, outFile, { version }) => {
		const outFilename = path.basename(entrypoint).replace('.ts', '.js')
		const jsOutFile = `./dist/${outFilename}`

		// First, build with esbuild so that it actually bundles ZX
		await esbuild.build({
			entryPoints: [entrypoint],
			outfile: jsOutFile,
			logLevel: 'warning',
			platform: 'node',
			target: 'node22',
			bundle: true,
			format: 'esm',
			sourcemap: 'both',
			treeShaking: true,
			minify: false,
		})

		// Next, compile to a binary with Bun
		const args: string[] = [
			'--compile',
			'--minify',
			'--sourcemap',
			'--target=bun',
			jsOutFile,
			'--outfile',
			outFile,
		]

		if (version && version.length > 0) {
			args.push(`--define=process.env.SENTRY_RELEASE='${version}'`)
		}

		await $`bun build ${args}`.verbose()

		// cleanup
		const jsFiles = await glob(`./dist/!(${path.basename(outFile)})`)
		await Promise.all(jsFiles.map((f) => fs.remove(f)))
	})

/*
buildCmd
	.command('bun-compile-rolldown')
	.description('build a bun app in compiled mode (using rolldown instead of esbuild)')

	.argument('<entrypoint>', 'e.g. ./src/index.ts')
	.argument('<out-file>', 'e.g. ./dist/cronjobs')
	.option('--version <version>', 'Release version of the app', validateArg(z.string()))

	.action(async (entrypoint, outFile, { version }) => {
		await getMetrics().trace({ category: 'build', name: 'bun-compile-rolldown' }, async () => {
			const outFilename = path.basename(entrypoint).replace('.ts', '.js')
			const jsOutFile = `./dist/${outFilename}`
			const bundle = await rolldown({
				// input options
				input: 'src/bin/geoboxctl.ts',
				platform: 'node',
			})

			// generate bundles in memory with different output options
			await bundle.generate({
				// output options
				format: 'esm',
			})

			// or directly write to disk
			await bundle.write({
				file: './dist/geoboxctl.js',
			})

			// Next, compile to a binary with Bun
			const args: string[] = [
				'--compile',
				'--minify',
				'--sourcemap',
				'--target=bun',
				jsOutFile,
				'--outfile',
				outFile,
			]

			if (version && version.length > 0) {
				args.push(`--define=process.env.SENTRY_RELEASE='${version}'`)
			}

			await $`bun build ${args}`.verbose()

			// cleanup
			// await fs.remove(esbuildOutFile)
		})
	})
*/

buildCmd
	.command('bundle-lib')
	.alias('lib')
	.description('Bundle library with esbuild (usually to resolve vitest issues)')

	.argument('<entrypoints...>', 'Entrypoint(s) of the app. e.g. src/index.ts')
	.option('-d, --root-dir <string>', 'Root directory to look for entrypoints')
	.option('-f, --format <format...>', 'Formats to use (options: esm, cjs)', ['esm'])
	.option(
		'--platform <string>',
		'Optional platform to target (options: node)',
		validateArg(z.enum(['node']))
	)

	.action(async (entryPoints, { format: moduleFormats, platform, rootDir }) => {
		entryPoints = z
			.string()
			.array()
			.min(1)
			.parse(entryPoints)
			.map((d) => path.join(rootDir ?? '.', d))

		type Format = z.infer<typeof Format>
		const Format = z.enum(['esm', 'cjs'])

		const formats = Format.array().parse(moduleFormats)

		await fs.rm('./dist/', { force: true, recursive: true })

		await Promise.all([
			$`runx-bundle-lib-build-types ${entryPoints}`,

			...formats.map(async (outFormat) => {
				type Config = {
					format: Format
					outExt: string
				}

				const { format, outExt } = match<'esm' | 'cjs', Config>(outFormat)
					.with('esm', () => ({
						format: 'esm',
						outExt: '.mjs',
					}))
					.with('cjs', () => ({
						format: 'cjs',
						outExt: '.cjs',
					}))
					.exhaustive()

				const opts: esbuild.BuildOptions = {
					entryPoints,
					outdir: './dist/',
					logLevel: 'warning',
					outExtension: {
						'.js': outExt,
					},
					target: 'es2022',
					bundle: true,
					format,
					sourcemap: 'both',
					treeShaking: true,
					external: ['node:events', 'node:async_hooks', 'node:buffer', 'cloudflare:test'],
				}

				if (platform) {
					opts.platform = platform
				}

				await timeFn('esbuild', () => esbuild.build(opts))()
			}),
		])
	})

buildCmd
	.command('vite')
	.description('Build using vite')
	.option(
		'--retry',
		'Automatically retry up to 3 times if the build fails. Useful for flakey build issues.',
		false
	)
	.action(async ({ retry: shouldRetry }) => {
		const doBuild = timeFn('vite build', async () => {
			const [hasFrameworkSourcemaps, isOrangeJs] = await Promise.all([
				shouldRemoveSourcemapsBeforeDeploy(),
				isOrangeJsProject(),
				fs.rm('dist', { force: true, recursive: true }),
				fs.rm('dist2', { force: true, recursive: true }),
			])

			await $({
				stdio: 'inherit',
				verbose: true,
			})`vite build`

			// Make sure we don't publish sourcemaps to Workers Assets
			if (hasFrameworkSourcemaps) {
				echo(chalk.blue('framework with sourcemaps detected!'))
				// back up the dist dir first to preserve sourcemaps
				await fs.copy('dist', 'dist2')

				// next, delete sourcemaps from the dist dir
				if (isOrangeJs) {
					// for orange-js projects, we want to keep the server
					// sourcemaps so that wrangler can upload it
					echo(chalk.blue('deleting client sourcemaps from dist:'))
					await $`find ./dist/client -type f -name '*js.map'`.verbose()
				} else {
					// otherwise, just delete all sourcemaps
					echo(chalk.blue('deleting sourcemaps from dist:'))
					await $`find ./dist -type f -name '*js.map'`.verbose()
				}
			}
		})

		if (shouldRetry) {
			await retry(5, '0s', doBuild)
		} else {
			await doBuild()
		}
	})
