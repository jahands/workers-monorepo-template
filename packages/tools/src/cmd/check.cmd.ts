import { Command } from '@commander-js/extra-typings'
import Table from 'cli-table3'

import { getRepoRoot } from '../path'
import { getOutcome } from '../proc'

export const checkCmd = new Command('check')
	.description(
		'Check for issues with deps/lint/types/format. If no options are provided, all checks are run.'
	)

	.option('-r, --root', 'Run checks from root of repo. Defaults to cwd', false)
	.option('-d, --deps', 'Check for dependency issues with Syncpack')
	.option('-l, --lint', 'Check for eslint issues')
	.option('-t, --types', 'Check for TypeScript issues')
	.option('-f, --format', 'Check for formatting issues with prettier')

	.option('--continue', 'Use --continue when executing turbo commands', false)

	.action(async ({ root, deps, lint, types, format, continue: useContinue }) => {
		const repoRoot = getRepoRoot()
		if (root) {
			cd(repoRoot)
		}
		// Run all if none are selected
		if (!deps && !lint && !types && !format) {
			deps = true
			lint = true
			types = true
			format = true
		}

		const cwd = process.cwd()
		const runFromRoot = cwd === repoRoot
		const cwdName = path.basename(cwd)

		const turboFlags = [
			// use all available CPU cores
			'--concurrency=100%',
		] satisfies string[]

		if (useContinue) {
			turboFlags.push('--continue')
		}

		const checks = {
			deps: ['pnpm', 'check:deps'],
			// eslint can be run from anywhere and it'll automatically only lint the current dir and children
			lint: ['run-eslint'],
			types: ['turbo', turboFlags, 'check:types'].flat(),
			format: ['pnpm', 'check:format'],
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
				const exitCode = await $`${checks.deps}`.exitCode
				table.push([
					'deps',
					checks.deps.join(' '),
					getAndCheckOutcome(exitCode),
					'Root',
				] satisfies TableRow)
			})
		}

		if (lint) {
			const exitCode = await $`${checks.lint}`.exitCode
			table.push([
				'lint',
				checks.lint.join(' '),
				getAndCheckOutcome(exitCode),
				runFromRoot ? 'Root' : `cwd (${cwdName})`,
			] satisfies TableRow)
		}

		if (types) {
			const exitCode = await $`${checks.types}`.exitCode
			table.push([
				'types',
				checks.types.join(' '),
				getAndCheckOutcome(exitCode),
				runFromRoot ? 'Root' : `cwd (${cwdName})`,
			] satisfies TableRow)
		}

		if (format) {
			await within(async () => {
				cd(repoRoot) // Must be run from root
				const exitCode = await $`${checks.format}`.exitCode
				table.push([
					'format',
					checks.format.join(' '),
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
