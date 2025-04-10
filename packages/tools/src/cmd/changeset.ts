import { Command } from '@commander-js/extra-typings'

import { getRepoRoot } from '../path'

export const changesetCmd = new Command('changeset')
	.description('Create a changeset')
	.action(async () => {
		cd(getRepoRoot())

		$.stdio = 'inherit'
		await $`bunx changeset`.verbose()
		await $`git add .changeset`
	})
