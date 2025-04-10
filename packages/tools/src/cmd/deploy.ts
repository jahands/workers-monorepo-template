import { Command } from '@commander-js/extra-typings'

import { getConfig } from '../config'
import { timeFn } from '../time'

import type { Options as ZXOptions } from 'zx'

export const deployCmd = new Command('deploy').description('Deploy Workers/Pages/etc.')

/** Default zx options */
const opts = {
	stdio: 'inherit',
	verbose: true,
} satisfies Partial<ZXOptions>

deployCmd
	.command('wrangler')
	.description('Deploy a Workers project with Wrangler')
	.option(
		'--no-output',
		`Don't output to ./dist directory (useful for frameworks with their own build)`
	)
	.option(
		'--no-minify',
		`Don't use --minify flag (useful for frameworks that already minify the output))`
	)
	.option(
		'--no-sourcemaps',
		`Don't upload sourcemaps (needed for some projects with too big of a sourcemap)`
	)
	.action(async ({ output, minify, sourcemaps }) => {
		const cfg = await getConfig()
		echo(chalk.blue(`Sentry version: ${cfg.version}`))

		if (output) {
			await fs.remove('./dist')
		}

		const cmd: string[] = [
			'wrangler',
			'deploy',

			// overridden vars:
			'--var',
			`SENTRY_RELEASE:${cfg.version}`,
			'--var',
			'ENVIRONMENT:production',
		]

		if (minify) {
			cmd.push('--minify')
		}
		if (output) {
			cmd.push('--outdir', './dist')
		}
		if (sourcemaps) {
			cmd.push('--upload-source-maps')
		}

		await retry(
			3,
			'1s',
			timeFn('wrangler deploy', () => $(opts)`${cmd}`)
		)
	})

deployCmd
	.command('pages')
	.description(
		'Deploy a Pages project using Wrangler. Note: may need tweeking to work with non-Remix projects.'
	)
	.argument('<project>', 'Pages project name to deploy', (p) => p)
	.action(async (project) => {
		const cfg = await getConfig()
		echo(chalk.blue(`Sentry version: ${cfg.version}`))
		await retry(
			3,
			'1s',
			timeFn(
				'wrangler pages deploy',
				() =>
					$(
						opts
					)`wrangler pages deploy ./build/client --commit-dirty=true --project-name ${project}`
			)
		)
	})
