import { Command } from '@commander-js/extra-typings'
import { validateArg } from '@jahands/cli-tools'
import { match } from 'ts-pattern'

import { z } from '@repo/zod'

import { getRepoRoot } from '../path'

const actions = ['add-account-id'] as const
export const updateWranglerTomlsCmd = new Command('update-wrangler-tomls')
	.description('Update all wrangler.toml files with one command')
	.argument(`action: <${actions.join('|')}>`, `Action to run`, validateArg(z.enum(actions)))
	.action(async (action) => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)

		const wranglerTomls = await glob('*/*/wrangler.toml')
		wranglerTomls.sort()

		await match(action)
			.with('add-account-id', async () => {
				for (const file of wranglerTomls) {
					const content = (await fs.readFile(file)).toString()
					const lines = content.split('\n')

					if (lines.find((l) => l.startsWith('account_id = '))) {
						echo(chalk.grey(`Skipping file that already has account_id: ${file}`))
					}

					await addAccountId(file, 'f9b1e1e2cf50cca79a58e395b6084239', 'main') // main account
				}
			})
			.exhaustive()
	})

/** Helper function to insert a line at a specific index of an array*/
function insertAt(lines: string[], idx: number, line: string) {
	lines.splice(idx, 0, line)
}

async function addAccountId(wranglerToml: string, accountId: string, accountName: string) {
	const content = (await fs.readFile(wranglerToml)).toString()
	const lines = content.split('\n')

	let nameIdx = 0
	if (lines[0].startsWith('#:schema')) {
		nameIdx = 1 // might start with schema instead of name
	}

	if (!lines[nameIdx].startsWith('name =')) {
		throw new Error(`invalid wrangler.toml - does not start with name?! ${wranglerToml}`)
	}

	insertAt(lines, nameIdx + 1, `account_id = "${accountId}" # ${accountName}`)

	await fs.writeFile(wranglerToml, lines.join('\n'))
}
