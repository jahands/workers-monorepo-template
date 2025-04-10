import { Command } from '@commander-js/extra-typings'
import * as jsonc from 'jsonc-parser'

import { z } from '@repo/zod'

import { getRepoRoot } from '../path'

export const settingsCmd = new Command('settings').description(
	'Manage vscode settings and workspaces'
)

const settingsToSync = [
	// Msc
	'files.associations',

	// TypeScript
	'typescript.preferences.autoImportFileExcludePatterns',

	// GitHub Actions
	'github-actions.workflows.pinned.workflows',
	'github-actions.workflows.pinned.refresh.enabled',
	'github-actions.workflows.pinned.refresh.interval',
] as const satisfies string[]

settingsCmd
	.command('sync-workspaces')
	.description('Sync common settings in Workspaces')
	.action(async () => {
		cd(getRepoRoot())
		const workspaceDir = path.resolve('.', '.vscode/workspaces')
		const templateName = 'workers.code-workspace'
		const templateWorkspacePath = `${workspaceDir}/${templateName}`
		const templateWorkspace = WorkspaceTemplate.parse(
			jsonc.parse(fs.readFileSync(templateWorkspacePath).toString())
		)

		const workspaces = (await glob(`${workspaceDir}/*.code-workspace`)).filter(
			(ws) => path.basename(ws) !== templateName
		)
		// also want to keep settings.json in sync in case the repo
		// is opened without a workspace
		workspaces.push(path.resolve('.', '.vscode/settings.json'))

		echo(chalk.blue(`Syncing settings across ${workspaces.length} workspaces...`))
		for (const wsPath of workspaces) {
			let wsConfig = (await fs.readFile(wsPath)).toString()

			for (const setting of settingsToSync) {
				const newSettingVal = templateWorkspace.settings[setting]
				if (!newSettingVal) {
					continue
				}

				// settings.json keeps settings in the top level, unlike workspaces
				const editPath =
					path.basename(wsPath) === 'settings.json' ? [setting] : ['settings', setting]

				const edits = jsonc.modify(wsConfig, editPath, newSettingVal, {
					formattingOptions: {
						insertFinalNewline: true,
						keepLines: true,
					},
				})
				wsConfig = jsonc.applyEdits(wsConfig, edits)
			}
			await fs.writeFile(wsPath, wsConfig)
		}

		echo(chalk.blue(`Fixing formatting...`))
		await $`runx fix --format`.quiet()
		echo(chalk.blue(`Done!`))
	})

type WorkspaceTemplate = z.infer<typeof WorkspaceTemplate>
const WorkspaceTemplate = z.object({
	settings: z.record(z.string(), z.any()),
})
