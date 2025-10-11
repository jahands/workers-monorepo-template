import { Command } from '@commander-js/extra-typings'

import { SHFMT_SKIPPED_EXIT_CODE } from '../proc'

export const shfmtCmd = new Command('shfmt').description('Format shell scripts with shfmt')

shfmtCmd
	.command('fix')
	.description('Format shell scripts with shfmt')
	.option(
		'--skip-if-unavailable',
		'Only run if shfmt and ripgrep are available, otherwise skip with a warning.',
		false
	)
	.action(async ({ skipIfUnavailable }) => {
		const mode: Mode = 'write'

		await checkShfmtAvailable(skipIfUnavailable, mode)

		await runShfmt(mode)
	})

shfmtCmd
	.command('check')
	.description('Check shell scripts with shfmt')
	.option(
		'--skip-if-unavailable',
		'Only run if shfmt and ripgrep are available, otherwise skip with a warning.',
		false
	)
	.action(async ({ skipIfUnavailable }) => {
		const mode: Mode = 'diff'

		await checkShfmtAvailable(skipIfUnavailable, mode)

		await runShfmt(mode)
	})

type Mode = 'write' | 'diff'

async function runShfmt(mode: Mode) {
	await Promise.all([
		$`rg --files-with-matches '^#!.*\\b(sh|bash|zsh|fish|dash|ksh|csh)\\b' -g '!*.*' .`
			.pipe($`xargs shfmt --case-indent ${`--${mode}`}`)
			.pipe(process.stderr),
		$({
			nothrow: true, // may not be any .sh files
		})`rg --files-with-matches '^#!.*\\b(sh|bash|zsh|fish|dash|ksh|csh)\\b' -g '*.sh' .`
			.pipe($`xargs shfmt --case-indent ${`--${mode}`}`)
			.pipe(process.stderr),
	])
}

async function checkShfmtAvailable(skipIfUnavailable: boolean, mode: Mode): Promise<void> {
	const [shfmtExit, rgExit] = await Promise.all([
		which('shfmt', { nothrow: true }),
		which('rg', { nothrow: true }),
	])

	const missing: string[] = []
	if (shfmtExit === null) {
		missing.push('shfmt')
	}
	if (rgExit === null) {
		missing.push('rg (ripgrep)')
	}

	if (missing.length > 0) {
		const missingStr = `${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} unavailable`

		if (skipIfUnavailable) {
			echo(chalk.yellow(`warning: ${missingStr}, skipping shell formatting`))
			process.exit(SHFMT_SKIPPED_EXIT_CODE)
		} else {
			const action = mode === 'write' ? 'fix' : 'check'
			echo(chalk.red(`error: ${missingStr}, unable to ${action} shell formatting`))
			process.exit(1)
		}
	}
}
