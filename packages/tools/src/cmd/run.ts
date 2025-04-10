import { Command } from '@commander-js/extra-typings'
import { cliError, validateArg } from '@jahands/cli-tools'
import Table from 'cli-table3'
import { match } from 'ts-pattern'

import { z } from '@repo/zod'

import { getRepoRoot } from '../path'

export const runCmd = new Command('run')
	.description('run commands in various packages with given filter')
	.requiredOption(
		'-F, --filter <string>',
		'filter preset for which packages to run within',
		validateArg(z.enum(['with-wrangler-config', 'with-vitest-config']))
	)
	.option('-y, --yes', 'Auto-confirm to run within dirs', false)
	.argument('<cmd...>', 'command to run - recommend adding -- first')
	.action(async (args, { filter, yes }) => {
		const repoRoot = getRepoRoot()

		const dirs = await match(filter)
			// Add all filters here
			.with('with-wrangler-config', async () => {
				cd(repoRoot)
				return [
					await glob('*/*/wrangler.jsonc'),
					await glob('1projects/*/wrangler.jsonc'),
					await glob('1projects/*/*/wrangler.jsonc'),
					await glob('1projects/*/*/*/wrangler.jsonc'),
				]
					.flat()
					.filter((p) => !p.includes('node_modules'))
					.map((wt) => path.dirname(wt))
			})
			.with('with-vitest-config', async () => {
				cd(repoRoot)
				return [
					await glob('*/*/vitest.config.ts'),
					await glob('1projects/*/vitest.config.ts'),
					await glob('1projects/*/*/vitest.config.ts'),
					await glob('1projects/*/*/*/vitest.config.ts'),
				]
					.flat()
					.filter((p) => !p.includes('node_modules'))
					.map((wt) => path.dirname(wt))
			})
			.exhaustive()

		dirs.sort()

		await runCmdInDirectories({ args, dirs, yes })
	})

async function runCmdInDirectories({
	args,
	dirs,
	yes,
}: {
	args: string[]
	dirs: string[]
	yes: boolean
}): Promise<void> {
	const repoRoot = getRepoRoot()

	const table = new Table({
		head: [chalk.whiteBright('Directories')],
	})
	for (const dir of dirs) {
		table.push([chalk.white(dir)])
	}
	echo(table.toString())

	console.log('Command: ', args)
	if (!yes) {
		const ans = await question('Run this command in the above directories? (yN) ', {
			choices: ['y', 'n'],
		})
		if (ans !== 'y') {
			throw cliError('Aborting!')
		}
	}

	for (const dir of dirs) {
		cd(`${repoRoot}/${dir}`)
		echo(chalk.blue(`\nRunning within: ${process.cwd()}`))
		await $({ stdio: 'inherit', verbose: true })`${args}`
	}
}
