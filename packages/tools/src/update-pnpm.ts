import { cliError } from '@jahands/cli-tools'
import Table from 'cli-table3'
import * as toml from 'smol-toml'
import { match } from 'ts-pattern'
import { z } from 'zod/v4'

import { getRepoRoot } from './path'
import { PackageJson } from './pkg'

type UpdateResult = {
	type: string
	updated: number
	failed: number
	files: string[]
	errors: string[]
}

export async function updatePnpm() {
	const $$ = $({
		verbose: false,
		stdio: 'pipe',
	})

	const repoRoot = getRepoRoot()
	cd(repoRoot)
	const miseAvailable = await which('mise')
	echo(chalk.white(`Checking for pnpm updates...`))
	const res = await fetch('https://registry.npmjs.org/pnpm')
	if (!res.ok) {
		throw cliError(`Failed to fetch pnpm registry: ${res.status}`)
	}
	const body = await res.json()
	const pnpm = NpmRegistryPnpmResponse.parse(body)
	const latest = pnpm['dist-tags'].latest
	echo(chalk.blue(`Latest pnpm version: ${latest}`))

	const results: UpdateResult[] = []

	if (miseAvailable) {
		const miseResult = await updateMiseTomlFiles(repoRoot, latest)
		results.push(miseResult)
	}

	const packageJsonResult = await updatePackageJsonFiles(repoRoot, latest)
	results.push(packageJsonResult)

	if (results.some((r) => r.updated > 0)) {
		echo(chalk.blue(`Fixing formatting...`))
		await $$`runx fix --format`
	}

	// Display summary table
	const table = new Table({
		head: [
			chalk.whiteBright('File Type'),
			chalk.whiteBright('Updated'),
			chalk.whiteBright('Failed'),
			chalk.whiteBright('Status'),
		],
	})

	let totalUpdated = 0
	let totalFailed = 0
	for (const result of results) {
		totalUpdated += result.updated
		totalFailed += result.failed

		const status = match(result)
			.when(
				(r) => r.failed > 0,
				() => chalk.red('Failed')
			)
			.when(
				(r) => r.updated > 0,
				() => chalk.green('Updated')
			)
			.otherwise(() => chalk.gray('No changes'))

		table.push([result.type, result.updated.toString(), result.failed.toString(), status])
	}

	// Show detailed errors if any
	for (const result of results) {
		if (result.errors.length > 0) {
			echo(chalk.red(`\nErrors in ${result.type}:`))
			for (const error of result.errors) {
				echo(chalk.red(`  ${error}`))
			}
		}
	}

	if (totalUpdated > 0) {
		if (miseAvailable) {
			echo(chalk.blue('\nRunning mise up...'))
			await $$`mise up`
		}

		echo(chalk.blue(`Fixing formatting...`))
		await $$`runx fix --format`

		echo(chalk.greenBright(`\nSuccessfully updated pnpm to ${latest}`))
	} else if (totalFailed > 0) {
		echo(chalk.red(`\nFailed to update some files. See errors above.`))
		process.exit(1)
	} else {
		echo(chalk.green(`\nNo pnpm updates needed, already on ${latest}`))
	}

	echo('\n' + table.toString())
}

const Semver = z.string().regex(/^\d+\.\d+\.\d+$/)
const NpmRegistryPnpmResponse = z.object({
	_id: z.literal('pnpm'),
	name: z.literal('pnpm'),
	'dist-tags': z.object({
		latest: Semver.describe('pnpm latest version, e.g. 9.5.0'),
	}),
})

type MiseToml = z.infer<typeof MiseToml>
const MiseToml = z
	.object({
		tools: z
			.object({
				pnpm: Semver.describe('pnpm version, e.g. 9.5.0').optional(),
			})
			.catchall(z.string()),
		alias: z.record(z.string(), z.string()).optional(),
	})
	.loose()

/**
 * Update package.json files with the new pnpm version
 * @param repoRoot - The root directory of the repository
 * @param newVersion - The new pnpm version
 * @returns UpdateResult with details about the operation
 */
async function updatePackageJsonFiles(repoRoot: string, newVersion: string): Promise<UpdateResult> {
	const result: UpdateResult = {
		type: 'package.json',
		updated: 0,
		failed: 0,
		files: [],
		errors: [],
	}

	const packageJsonFiles = await glob('**/package.json', {
		cwd: repoRoot,
		gitignore: true,
		ignore: ['**/node_modules/**', 'turbo/generators/**'],
	})

	for (const file of packageJsonFiles) {
		const filePath = `${repoRoot}/${file}`

		try {
			const packageJson = PackageJson.loose().parse(await Bun.file(filePath).json())

			if (packageJson.packageManager?.startsWith('pnpm@')) {
				const currentVersion = packageJson.packageManager.replace('pnpm@', '')
				if (currentVersion !== newVersion) {
					echo(chalk.blue(`Updating ${file} packageManager to pnpm@${newVersion}`))
					packageJson.packageManager = `pnpm@${newVersion}`
					await Bun.file(filePath).write(JSON.stringify(packageJson, null, 2) + '\n')
					result.updated++
					result.files.push(file)
				}
			}
		} catch (e) {
			result.failed++
			result.errors.push(`Failed to update ${file}: ${e instanceof Error ? e.message : String(e)}`)
		}
	}

	return result
}

/**
 * Update mise.toml and .mise.toml files with the new pnpm version
 * @param repoRoot - The root directory of the repository
 * @param newVersion - The new pnpm version
 * @returns UpdateResult with details about the operation
 */
async function updateMiseTomlFiles(repoRoot: string, newVersion: string): Promise<UpdateResult> {
	const result: UpdateResult = {
		type: 'mise.toml',
		updated: 0,
		failed: 0,
		files: [],
		errors: [],
	}

	const miseTomlFiles = await glob('**/{.mise.toml,mise.toml}', {
		cwd: repoRoot,
		gitignore: true,
		ignore: ['**/node_modules/**'],
	})

	for (const file of miseTomlFiles) {
		const filePath = `${repoRoot}/${file}`

		try {
			const miseToml = MiseToml.parse(toml.parse(await Bun.file(filePath).text()))

			if (miseToml.tools.pnpm && miseToml.tools.pnpm !== newVersion) {
				echo(chalk.blue(`Updating ${file} to pnpm@${newVersion}`))
				miseToml.tools.pnpm = newVersion
				const miseString = toml.stringify(miseToml) + '\n'
				await Bun.file(filePath).write(miseString.replaceAll('"', "'"))
				result.updated++
				result.files.push(file)
			}
		} catch (e) {
			result.failed++
			result.errors.push(`Failed to update ${file}: ${e instanceof Error ? e.message : String(e)}`)
		}
	}

	return result
}
