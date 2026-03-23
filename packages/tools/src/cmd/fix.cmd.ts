import { Command } from '@commander-js/extra-typings'
import Table from 'cli-table3'

import { getRepoRoot } from '../path'
import { getOutcome, SHFMT_SKIPPED_EXIT_CODE } from '../proc'

export const fixCmd = new Command('fix')
	.description('Fix deps/lint/format issues. If no options are provided, all fixes are run.')

	.option('-r, --root', 'Run fixes from root of repo. Defaults to cwd', false)
	.option('-d, --deps', 'Fix dependency versions with syncpack')
	.option('-l, --lint', 'Fix oxlint issues')
	.option('-f, --format', 'Format code with prettier')
	.option(
		'-w, --workers-types',
		'Generate Workers runtime types (worker-configuration.d.ts) via wrangler types'
	)

	.action(async ({ root, deps, lint, format, workersTypes }) => {
		const repoRoot = getRepoRoot()
		if (root) {
			cd(repoRoot)
		}

		// Run all if none are selected
		if (!deps && !lint && !format && !workersTypes) {
			deps = true
			lint = true
			format = true
			workersTypes = true
		}

		const cwd = process.cwd()
		const runFromRoot = cwd === repoRoot
		const cwdName = path.basename(cwd)
		const turboFlags = [
			// use all available CPU cores
			'--concurrency=100%',
		] satisfies string[]

		const fixes = {
			deps: ['run-fix-deps'],
			lint: ['run-oxlint', '--fix'],
			workersTypes: ['turbo', turboFlags, 'fix:workers-types'].flat(),
			format: ['prettier', '.', '--cache', '--write', '--log-level=warn'],
			formatShell: ['runx', 'shfmt', 'fix', '--skip-if-unavailable'],
		} as const satisfies { [key: string]: string[] }

		type TableRow = [string, string, string, string]
		const table = new Table({
			head: [
				chalk.whiteBright('Name'),
				chalk.whiteBright('Command'),
				chalk.whiteBright('Outcome'),
				chalk.whiteBright('Ran From'),
			] satisfies TableRow,
		})

		$.stdio = 'inherit'
		$.verbose = true
		$.nothrow = true

		let didErr = false
		function getAndCheckOutcome({
			exitCode,
			skippedCode,
		}: {
			exitCode: number | null
			skippedCode?: number
		}): string {
			if (exitCode !== 0 && exitCode !== skippedCode) {
				didErr = true
			}
			return getOutcome({ exitCode, skippedCode })
		}

		if (deps) {
			const exitCode = await $({
				cwd: repoRoot, // Must be run from root
			})`${fixes.deps}`.exitCode
			table.push([
				'deps',
				fixes.deps.join(' '),
				getAndCheckOutcome({ exitCode }),
				'Root',
			] satisfies TableRow)
		}

		if (lint) {
			const exitCode = await $`${fixes.lint}`.exitCode
			table.push([
				'lint',
				fixes.lint.join(' '),
				getAndCheckOutcome({ exitCode }),
				runFromRoot ? 'Root' : `cwd (${cwdName})`,
			] satisfies TableRow)
		}

		if (workersTypes) {
			const exitCode = await $({
				cwd: repoRoot, // Must be run from root
			})`${fixes.workersTypes}`.exitCode
			table.push([
				'workers types',
				fixes.workersTypes.join(' '),
				getAndCheckOutcome({ exitCode }),
				runFromRoot ? 'Root' : `cwd (${cwdName})`,
			] satisfies TableRow)
		}

		if (format) {
			echo(chalk.dim('formatting with prettier (and shfmt if available)...'))

			const [prettierProc, shfmtProc] = await Promise.all([
				$({
					cwd: repoRoot, // Must be run from root
				})`${fixes.format}`,

				$({
					cwd: repoRoot, // Must be run from root
				})`${fixes.formatShell}`,
			])

			table.push(
				[
					'format',
					fixes.format.join(' '),
					getAndCheckOutcome({ exitCode: prettierProc.exitCode }),
					'Root',
				] satisfies TableRow,
				[
					'format shell',
					fixes.formatShell.join(' '),
					getAndCheckOutcome({
						exitCode: shfmtProc.exitCode,
						skippedCode: SHFMT_SKIPPED_EXIT_CODE,
					}),
					'Root',
				] satisfies TableRow
			)
		}

		echo(table.toString())

		if (didErr) {
			process.exit(1)
		}
	})
