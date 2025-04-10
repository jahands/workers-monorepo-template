import { Command } from '@commander-js/extra-typings'

import { z } from '@repo/zod'

import { getRepoRoot } from '../path'

export const mscCmd = new Command('msc').description('msc one-off commands for fixing things')

const PackageJson = z
	.object({
		name: z.string(),
		dependencies: z.record(z.string(), z.string()).optional(),
		devDependencies: z.record(z.string(), z.string()).optional(),
	})
	.passthrough()

mscCmd
	.command('move-deps-to-dev-deps')
	.description(`Moves some deps from deps to devDeps`)
	.action(async () => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)

		const files = (
			await Promise.all([
				glob('./*/*/package.json'),
				glob('./1projects/*/*/package.json'),
				glob('./1projects/*/*/*/package.json'),
			])
		)
			.flat()
			.filter((p) => !['node_modules', 'dist', '.astro', '.wrangler'].some((s) => p.includes(s)))

		echo(chalk.grey(`Processing ${files.length} package.json files...`))

		const devDepsToMove: string[] = [
			'@repo/eslint-config',
			'@repo/typescript-config',
			'@repo/tools',
		]

		let shouldFormat = false
		for (const filePath of files) {
			const pkgJson = PackageJson.parse(JSON.parse((await fs.readFile(filePath)).toString()))
			let updated = false
			for (const dep of devDepsToMove) {
				if (pkgJson.dependencies && pkgJson.dependencies[dep] !== undefined) {
					updated = true
					shouldFormat = true
					echo(chalk.blue(`Updating ${chalk.green(pkgJson.name)} for dep: ${chalk.grey(dep)}`))
					if (!pkgJson.devDependencies) {
						pkgJson.devDependencies = {}
					}

					pkgJson.devDependencies[dep] = pkgJson.dependencies[dep]
					delete pkgJson.dependencies[dep]
				}
			}
			if (updated) {
				await fs.writeFile(filePath, JSON.stringify(pkgJson, null, 2))
			}
		}

		if (shouldFormat) {
			await $({ stdio: 'inherit', verbose: true })`just fix --format && just install`
		}
	})
