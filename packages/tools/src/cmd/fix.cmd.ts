import { Command } from '@commander-js/extra-typings'
import Table from 'cli-table3'

import { getRepoRoot } from '../path'
import { getOutcome } from '../proc'

export const fixCmd = new Command('fix')
	.description('Fix deps/lint/format issues. If no options are provided, all fixes are run.')

	.option('-r, --root', 'Run fixes from root of repo. Defaults to cwd', false)
	.option('-d, --deps', 'Fix dependency versions with syncpack')
	.option('-l, --lint', 'Fix eslint issues')
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
			deps: ['pnpm', 'fix:deps'],
			lint: ['FIX_ESLINT=1', 'turbo', turboFlags, 'check:lint'].flat(),
			workersTypes: ['turbo', turboFlags, 'fix:workers-types'].flat(),
			format: ['pnpm', 'fix:format'],
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
		function getAndCheckOutcome(exitCode: number | null): string {
			if (exitCode !== 0) {
				didErr = true
			}
			return getOutcome(exitCode)
		}

		if (deps) {
			await within(async () => {
				cd(repoRoot) // Must be run from root
				const exitCode = await $`${fixes.deps}`.exitCode
				table.push([
					'deps',
					fixes.deps.join(' '),
					getAndCheckOutcome(exitCode),
					'Root',
				] satisfies TableRow)
			})
		}

		if (lint) {
			const exitCode = await $`${fixes.lint}`.exitCode
			table.push([
				'lint',
				fixes.lint.join(' '),
				getAndCheckOutcome(exitCode),
				runFromRoot ? 'Root' : `cwd (${cwdName})`,
			] satisfies TableRow)
		}

		if (workersTypes) {
			await within(async () => {
				const exitCode = await $`${fixes.workersTypes}`.exitCode
				table.push([
					'workers types',
					fixes.workersTypes.join(' '),
					getAndCheckOutcome(exitCode),
					runFromRoot ? 'Root' : `cwd (${cwdName})`,
				] satisfies TableRow)
			})
		}

		if (format) {
			await within(async () => {
				cd(repoRoot) // Must be run from root
				const exitCode = await $`${fixes.format}`.exitCode
				table.push([
					'format',
					fixes.format.join(' '),
					getAndCheckOutcome(exitCode),
					'Root',
				] satisfies TableRow)
			})
		}

		echo(table.toString())

		if (didErr) {
			process.exit(1)
		}
	})
