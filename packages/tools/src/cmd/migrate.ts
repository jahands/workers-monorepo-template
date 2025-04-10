import { Command } from '@commander-js/extra-typings'
import { parse as parseJsonc } from 'jsonc-parser'
import pAll from 'p-all'

import { z } from '@repo/zod'

import { getRepoRoot } from '../path'

export const migrateCmd = new Command('migrate').description('Migrate various things in the repo')

migrateCmd
	.command('to-wrangler-types')
	.description('Migrate all Workers to use wrangler types instead of @cloudflare/workers-types')
	.action(async () => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)
		const workersProjects = await Promise.all(
			[
				await glob('*/*/wrangler.jsonc'),
				await glob('1projects/*/wrangler.jsonc'),
				await glob('1projects/*/*/wrangler.jsonc'),
				await glob('1projects/*/*/*/wrangler.jsonc'),
			]
				.flat()
				.filter((p) => !p.includes('node_modules'))
				.map((p) => new WorkersProject(p).load())
		)

		for (const proj of workersProjects) {
			await proj.updatePackageJson()
		}

		await $`pnpm install --child-concurrency=10`.verbose()

		await pAll(
			workersProjects.map((proj) => async () => {
				await $({
					cwd: proj.packageDir,
					verbose: true,
					stdio: 'pipe',
				})`bun wrangler types --include-env=false`
			}),
			{
				concurrency: 10,
			}
		)

		for (const proj of workersProjects) {
			const typesPath = `${proj.packageDir}/worker-configuration.d.ts`
			await Bun.write(typesPath, (await Bun.file(typesPath).text()).replace('interface Env {}', ''))
		}

		echo(chalk.blue('Fixing formatting...'))
		await $`bun runx fix --format`.quiet()
		echo(chalk.green('Done!'))
	})

class WorkersProject {
	readonly packageJsonPath: string
	readonly packageDir: string
	constructor(readonly wranglerJsoncPath: string) {
		this.packageDir = path.dirname(wranglerJsoncPath)
		this.packageJsonPath = `${this.packageDir}/package.json`
	}

	async load(): Promise<WorkersProject> {
		z.object({ name: z.string().min(1) }).parse(await Bun.file(this.packageJsonPath).json())
		z.object({ name: z.string().min(1) }).parse(
			parseJsonc(await Bun.file(this.wranglerJsoncPath).text())
		)
		return this
	}

	async updatePackageJson(): Promise<void> {
		const pkgJson = z
			.object({
				dependencies: z.record(z.string(), z.string()),
				devDependencies: z.record(z.string(), z.string()),
			})
			.passthrough()
			.parse(await Bun.file(this.packageJsonPath).json())

		if (pkgJson.dependencies['@cloudflare/workers-types'] !== undefined) {
			echo(chalk.grey(`Removing from ${this.packageJsonPath} dependencies`))
			delete pkgJson.dependencies['@cloudflare/workers-types']
		}
		if (pkgJson.devDependencies['@cloudflare/workers-types'] !== undefined) {
			echo(chalk.grey(`Removing from ${this.packageJsonPath} devDependencies`))
			delete pkgJson.devDependencies['@cloudflare/workers-types']
		}
		pkgJson.devDependencies['@types/node'] = '22.13.10'
		await Bun.file(this.packageJsonPath).write(JSON.stringify(pkgJson, null, 2))
	}
}

migrateCmd
	.command('simplify-tsconfigs')
	.description('Migrate all tsconfigs to use simplified config now that workers.json handles this')
	.action(async () => {
		const repoRoot = getRepoRoot()
		cd(repoRoot)
		const workersProjects = await Promise.all(
			[
				await glob('*/*/wrangler.jsonc'),
				await glob('1projects/*/wrangler.jsonc'),
				await glob('1projects/*/*/wrangler.jsonc'),
				await glob('1projects/*/*/*/wrangler.jsonc'),
			]
				.flat()
				.filter((p) => !p.includes('node_modules'))
		)

		const tsconfigs = workersProjects.map((p) => `${path.dirname(p)}/tsconfig.json`)
		for (const tsconfigPath of tsconfigs) {
			const data = TSConfig.parse(await Bun.file(tsconfigPath).json())
			if (data.extends === '@repo/typescript-config/workers.json') {
				if (data.include || data.exclude) {
					echo(chalk.blue(`updating ${tsconfigPath}`))
					// include/exclude are automatic now
					delete data.include
					delete data.exclude
					await Bun.file(tsconfigPath).write(JSON.stringify(data, null, 2))
				}
			} else {
				echo(chalk.blue(`Other: ${tsconfigPath}`))
				console.log(data)
			}
		}
	})

type TSConfig = z.infer<typeof TSConfig>
const TSConfig = z
	.object({
		extends: z.union([z.string(), z.string().array()]).optional(),
		include: z.string().array().optional(),
		exclude: z.string().array().optional(),
	})
	.passthrough()
