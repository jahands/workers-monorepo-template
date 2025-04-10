import { Command } from '@commander-js/extra-typings'

import { getRepoRoot } from '../../path'

export const prettierCmd = new Command('prettier')
	.description('Format and check code with prettier')
	.hook('preAction', () => {
		$.verbose = true
		$.stdio = 'inherit'
	})

prettierCmd
	.command('format')
	.description('Format code with prettier')
	.action(async () => {
		await $`prettier . --write --cache --ignore-unknown`
	})

prettierCmd
	.command('check')
	.description('Check code formatting with prettier')
	.action(async () => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)

		const ignorePaths: string[] = [
			`${repoRoot}/.prettierignore`,
			`${repoRoot}/.gitignore`,
		]
			.map((p) => path.relative(repoRoot, p))
			.map((p) => [`--ignore-path`, p])
			.flat()

		await $`prettier . --check --cache --ignore-unknown ${ignorePaths}`
	})
