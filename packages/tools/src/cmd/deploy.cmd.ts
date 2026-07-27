import { Command } from '@commander-js/extra-typings'

import { timeFn } from '../time'
import { getPackageJson } from '../workspace/package-json'

import type { Options as ZXOptions } from 'zx'

export const deployCmd = new Command('deploy').description('Deploy Workers projects')

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
		`Don't use --minify flag (useful for frameworks that already minify the output)`
	)
	.option(
		'--no-sourcemaps',
		`Don't upload sourcemaps (needed for some projects with too big of a sourcemap)`
	)
	.option('-c, --config <path>', 'Use specified wrangler config')
	.action(async ({ output, minify, sourcemaps, config: wranglerConfigPath }) => {
		const pkgJson = await getPackageJson()
		const gitSha = (await $`git log -1 --pretty=format:%h`.quiet().text()).trim()
		const release = `${pkgJson.version ?? '0.0.0'}-${gitSha}`

		if (output) {
			await fs.remove('./dist')
		}

		const cmd: string[] = [
			'wrangler',
			'deploy',

			// overridden vars:
			'--var',
			`RELEASE:${release}`,
			'--var',
			'ENVIRONMENT:production',
		]

		if (wranglerConfigPath) {
			cmd.push('--config', wranglerConfigPath)
		}

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
