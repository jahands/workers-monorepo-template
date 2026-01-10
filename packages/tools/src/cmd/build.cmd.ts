import { Command } from '@commander-js/extra-typings'
import { validateArg } from '@jahands/cli-tools/args'
import * as esbuild from 'esbuild'
import pMap from 'p-map'
import { match } from 'ts-pattern'
import { z } from 'zod'

import { TSHelpers } from '../tsconfig'

import type { CompilerOptions as TSCompilerOptions } from 'typescript'

export const buildCmd = new Command('build').description('Scripts to build things')

type Format = z.infer<typeof Format>
const Format = z.enum(['esm', 'cjs'])

buildCmd
	.command('tsc')
	.description('Build a library with tsc')
	.argument('<entrypoint...>', 'Entrypoint(s) for the program')
	.option('-r, --root-dir <string>', 'Root dir for tsc to use (overrides tsconfig.json)')
	.action(async (entrypoints, { rootDir }) => {
		const tsHelpers = await new TSHelpers().init()
		await $`rm -rf ./dist`

		const tsOptions: TSCompilerOptions = {
			...tsHelpers.getTSConfig(),
			...(rootDir !== undefined && { rootDir }),
		}

		tsHelpers.ts.createProgram(entrypoints, tsOptions).emit()
	})

buildCmd
	.command('bundle-lib')
	.alias('lib')
	.description('Bundle library with esbuild')

	.argument('<entrypoints...>', 'Entrypoint(s) of the app. e.g. src/index.ts')
	.option('-d, --root-dir <string>', 'Root directory to look for entrypoints')
	.option('-f, --format <format...>', 'Formats to use (options: esm, cjs)', ['esm'])
	.option('--no-minify', `Don't minify output`)
	.option(
		'--sourcemap <string>',
		`Include sourcemaps in the output. (options: both, linked, inline, external, true, false)`,
		validateArg(z.union([z.enum(['both', 'linked', 'inline', 'external']), z.coerce.boolean()])),
		'both'
	)
	.option(
		'--platform <string>',
		'Optional platform to target. (options: cloudflare_workers,browser, node, neutral)',
		validateArg(z.enum(['cloudflare_workers', 'browser', 'node', 'neutral'])),
		'cloudflare_workers'
	)
	.option('--no-types', `Don't include .d.ts types in output (usually not recommended)`)

	.action(
		async (entryPoints, { format: moduleFormats, platform, rootDir, minify, sourcemap, types }) => {
			entryPoints = z
				.string()
				.array()
				.min(1)
				.decode(entryPoints)
				.map((d) => path.join(rootDir ?? '.', d))

			const formats = Format.array().parse(moduleFormats)

			await fs.rm('./dist/', { force: true, recursive: true })

			const maybeOutputTypes = types
				? $({
						stdio: 'inherit',
					})`runx build bundle-lib-build-types ${entryPoints}`
				: undefined

			await Promise.all([
				maybeOutputTypes,
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

					const external: string[] = []
					if (platform === 'cloudflare_workers') {
						external.push('node:events', 'node:async_hooks', 'node:buffer', 'cloudflare:test')
					}

					const opts: esbuild.BuildOptions = {
						entryPoints,
						outdir: './dist/',
						logLevel: 'warning',
						outExtension: {
							'.js': outExt,
						},
						target: 'es2022',
						bundle: true,
						minify,
						format,
						sourcemap,
						treeShaking: true,
						external,
					}

					if (platform !== 'cloudflare_workers') {
						opts.platform = platform
					}

					await esbuild.build(opts)
				}),
			])
		}
	)

buildCmd
	.command('bundle-lib-build-types')
	.description('Separate command to build types (so that we can run them concurrently)')
	.argument('<entrypoints...>', 'Entrypoint(s) of the app. e.g. src/index.ts')
	.action(async (entryPoints) => {
		const tsHelpers = await new TSHelpers().init()
		const { ts } = tsHelpers
		z.string().array().min(1).decode(entryPoints)

		const tsCompOpts = {
			...tsHelpers.getTSConfig(),
			declaration: true,
			declarationMap: true,
			emitDeclarationOnly: true,
			noEmit: false,
			outDir: './dist/',
		} satisfies TSCompilerOptions

		const program = ts.createProgram(entryPoints, tsCompOpts)
		program.emit()
	})

buildCmd
	.command('bun')
	.description('Bundle with Bun')

	.argument('<entrypoints...>', 'Entrypoint(s) of the app. e.g. src/index.ts')
	.option('-f, --format <format...>', 'Formats to use (options: esm, cjs)', ['esm'])
	.option('--no-minify', `Don't minify output`)
	.option('--no-sourcemap', `Don't include sourcemaps`)

	.action(async (entryPoints, { format, minify, sourcemap }) => {
		await fs.rm('./dist/', { force: true, recursive: true })

		const formats = await z
			.array(Format)
			.parseAsync(format)
			.catch((e) => {
				throw new Error(`Invalid format: ${z.prettifyError(e)}`)
			})

		await Promise.all([
			$({
				stdio: 'inherit',
			})`runx build bundle-lib-build-types ${entryPoints}`,

			...formats.map(async (fmt) => {
				const distDir = `./dist/${fmt}`

				await Bun.build({
					entrypoints: entryPoints,
					outdir: distDir,
					target: 'node',
					minify,
					format: fmt,
				})

				const outExt = match(fmt)
					.with('esm', () => '.mjs')
					.with('cjs', () => '.cjs')
					.exhaustive()

				// change output files to mjs/cjs
				await pMap(await glob(`${distDir}/**/*.js`), async (file) => {
					await fs.rename(file, file.replace(/\.js$/, outExt))
				})
			}),
		])

		const cleanupSourcemaps = async () => {
			if (sourcemap === false) {
				const files = await glob('dist/**/*.map')
				await Promise.all(files.map((file) => fs.rm(file)))
			}
		}

		// executables don't need declaration files
		const cleanupBin = async () => {
			const files = await glob('dist/bin/*.d.ts')
			await Promise.all(files.map((file) => fs.rm(file)))
		}

		await Promise.all([cleanupSourcemaps(), cleanupBin()])

		// check if bin is empty
		const files = await glob('dist/bin/*')
		if (files.length === 0) {
			await fs.rm('dist/bin', { recursive: true })
		}
	})
