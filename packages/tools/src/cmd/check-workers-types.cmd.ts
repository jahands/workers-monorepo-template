import { Command } from '@commander-js/extra-typings'

export const checkWorkersTypesCmd = new Command('check-workers-types')
	.description('Assert that there are no new or modified worker-configuration.d.ts files')
	.action(async () => {
		const modifiedFiles = await $`git diff --name-only -- '**/worker-configuration.d.ts'`.text()
		const newFiles =
			await $`git ls-files --others --exclude-standard '**/worker-configuration.d.ts'`.text()

		if (modifiedFiles || newFiles) {
			console.error('error: Workers types are out of date!')
			if (modifiedFiles) {
				console.error(`Modified files:`)
				console.error(chalk.grey(formatList(modifiedFiles)))
			}
			if (newFiles) {
				console.error(`New files:`)
				console.error(chalk.grey(formatList(newFiles)))
			}
			console.error(`Please run 'just fix -w' to update Workers types`)
			process.exit(1)
		}
	})

function formatList(s: string): string {
	return s
		.trim()
		.split('\n')
		.map((l) => `- ${l}`)
		.join('\n')
}
