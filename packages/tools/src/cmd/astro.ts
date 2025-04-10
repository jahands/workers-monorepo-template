import { fileURLToPath } from 'node:url'
import { Command } from '@commander-js/extra-typings'
import { validateArg } from '@jahands/cli-tools'
import * as esbuild from 'esbuild'

import { z } from '@repo/zod'

import { ensureDevVarsExists } from '../dev-vars'
import { timeFn } from '../time'

export const astroCmd = new Command('astro').description('Astro-related commands')

astroCmd
	.command('dev')
	.description('Run astro dev server')
	.action(async () => {
		await ensureDevVarsExists()
		await $({
			stdio: 'inherit',
			verbose: true,
		})`astro dev`
	})

astroCmd
	.command('build')
	.description('Build astro app')
	.option(
		'-e, --entrypoint <path>',
		`Path to entrypoint that exports all Workers handlers. Set to "none" to disable
		(useful for sites that don't need to inject handlers, such as a static docs site.)`,
		validateArg(z.enum(['none']).or(z.string().and(z.object({})))),
		'./src/lib/_worker.ts'
	)
	.action(async ({ entrypoint }) => {
		// Build the main app with Astro
		const baseDir = path.resolve(path.basename(fileURLToPath(import.meta.url)), '..')
		await timeFn(
			'> astro build',
			() =>
				$({
					env: process.env,
					stdio: 'inherit',
					verbose: true,
				})`astro build`
		)()

		if (entrypoint !== 'none') {
			// Move the _worker.js file built by Astro so that
			// it can be imported by the entrypoint
			await fs.move(
				`${baseDir}/dist/_worker.js/index.js`,
				`${baseDir}/dist/_worker.js/_worker_base.js`
			)

			// Bundle everything together so that our Astro app and
			// other handlers are exported
			echo(chalk.blue('Bundling final Worker with esbuild...'))

			await timeFn('> astro build (esbuild)', () =>
				esbuild.build({
					entryPoints: [path.resolve(baseDir, entrypoint)],
					outfile: `${baseDir}/dist/_worker.js/index.js`,
					logLevel: 'info',
					target: 'es2022',
					format: 'esm',
					bundle: false,
					sourcemap: 'both',
				})
			)()
		}
	})
