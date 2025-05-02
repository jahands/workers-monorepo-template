import { Command } from '@commander-js/extra-typings'
import { validateArg } from '@jahands/cli-tools'
import * as esbuild from 'esbuild'
import { match } from 'ts-pattern'

import { z } from '@repo/zod'

export const buildCmd = new Command('build').description('Scripts to build things')

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
			$({
				stdio: 'inherit',
			})`runx-bundle-lib-build-types ${entryPoints}`,

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

				await esbuild.build(opts)
			}),
		])
	})
