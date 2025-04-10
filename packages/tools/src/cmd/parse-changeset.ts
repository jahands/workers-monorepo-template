import { Command } from '@commander-js/extra-typings'

import { getRepoRoot } from '../path'

export const parseChangesetCmd = new Command('parse-changeset')
	.argument('<path>', 'Path to changeset to parse')
	.option('--strip-packages', 'Strip packages from changeset')
	.option('-v, --verbose', 'Verbose output')
	.action(async (path, { stripPackages, verbose }) => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)
		verbose && echo(chalk.blue(`Parsing changeset from ${path}`))
		let changeset = await Bun.file(path).text()
		if (stripPackages) {
			const lines = changeset.split('\n')
			let start = 0
			let backticksCount = 0
			// Remove patch changes from git commit
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i]
				if (backticksCount === 2) {
					start = i + 1
					break
				} else if (line.startsWith('---')) {
					backticksCount++
				}
			}
			changeset = lines.slice(start).join('\n').trim()
		}
		echo(changeset)
	})
