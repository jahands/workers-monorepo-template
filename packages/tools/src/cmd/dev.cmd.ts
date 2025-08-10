import { Command } from '@commander-js/extra-typings'

import { getRepoRoot } from '../path'

export const devCmd = new Command('dev')
	.description(
		'Run development server for Workers projects, etc. Use --runx-help to see all options.'
	)
	.argument(
		'[args...]',
		'Arguments to pass to the dev script. May need to use -- to pass options to the dev script.'
	)
	.allowUnknownOption()
	// allow passing --help to the dev script
	.helpOption('--runx-help')
	.action(async (args) => {
		const cwd = process.cwd()
		const repoRoot = getRepoRoot()
		const isRepoRoot = cwd === repoRoot

		const [hasDevScript, hasWranglerJsonc] = await Promise.all([
			fs
				.readJson('./package.json')
				.then((packageJson) => packageJson.scripts?.dev !== undefined)
				.catch(() => {
					return false
				}),
			fs.pathExists('./wrangler.jsonc'),
		])

		$.stdio = 'inherit'

		if (!isRepoRoot && (hasWranglerJsonc || hasDevScript)) {
			await $`pnpm dev ${args}`
		} else {
			const argsWithSeparator = args.length > 0 ? ['--', ...args] : args
			await $`pnpm turbo dev ${argsWithSeparator}`
		}
	})
