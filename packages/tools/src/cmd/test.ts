import { Command } from '@commander-js/extra-typings'
import * as pkg from 'empathic/package'

import { z } from '@repo/zod'

import { builtPackages } from '../constants'
import { getRepoRoot } from '../path'

export const testCmd = new Command('test')
	.description('Run vitest tests')
	.option('-a, --all', 'Run tests from root of repo. Defaults to cwd', false)
	.option('-w, --watch', 'Run vitest in watch mode')
	.option('-b, --auto-build', 'Autobuild dependencies', false)
	.argument(
		'[args...]',
		'Arguments to pass to vitest. Use -- before passing options starting with -'
	)
	.action(async (args, { all, watch, autoBuild }) => {
		if (all) {
			cd(getRepoRoot())
		}
		const cmd: string[] = ['bun', 'vitest', '--testTimeout', '15000']
		if (!watch) {
			cmd.push('--run')
		}

		$.stdio = 'inherit'
		$.verbose = true

		if (autoBuild) {
			const pkgJsonPath = pkg.up()
			if (!pkgJsonPath) {
				throw new Error('unable to find package.json')
			}
			const pkgJson = z
				.object({
					name: z.string(),
				})
				.parse(await Bun.file(pkgJsonPath).json())

			if (pkgJson.name === 'workers-monorepo') {
				// Only build known packages rather than everything to save time
				await $`turbo build ${builtPackages.map((p) => ['-F', p]).flat()}`
			} else {
				// This will only built dependent packages of the current
				// package (+ the current package itself, unfortunately)
				await $`turbo build`
			}
		}

		await $`${cmd} ${args}`
	})
