import pMap from 'p-map'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { $, fs, glob, path } from 'zx'

import { getRepoRoot } from '../path'
import { PackageJson } from './package-json'

export type PnpmWorkspace = z.infer<typeof PnpmWorkspace>
const PnpmWorkspace = z.object({
	packages: z.array(z.string()),
})

async function getPnpmWorkspace(): Promise<PnpmWorkspace> {
	const repoRoot = getRepoRoot()
	const workspaceYamlPath = path.join(repoRoot, 'pnpm-workspace.yaml')
	const workspaceYamlContent = (await fs.readFile(workspaceYamlPath)).toString()
	return PnpmWorkspace.parse(parseYaml(workspaceYamlContent))
}

export type WorkspacePackage = {
	/** name of the package from package.json */
	name: string
	/** package path relative to repo root */
	path: string
	/** absolute path to package */
	fullPath: string
	/** absolute path to package.json */
	pkgJsonPath: string
}

/**
 * Get all workspace packages sorted by path.
 * This is the standard way to get all packages in the workspace.
 *
 * @returns Promise of sorted WorkspacePackage array
 *
 * @example
 * ```typescript
 * const packages = await getWorkspacePackages()
 * for (const pkg of packages) {
 *   console.log(`Package: ${pkg.name} at ${pkg.path}`)
 * }
 * ```
 */
export async function getWorkspacePackages(): Promise<WorkspacePackage[]> {
	const repoRoot = getRepoRoot()
	const pnpmWorkspace = await getPnpmWorkspace()

	const packagePatterns = pnpmWorkspace.packages.map((pattern) => `${pattern}/package.json`)

	const packageJsons = await globProjectFiles(packagePatterns, {
		dot: true,
		ignore: [
			'./package.json', // root package.json
		],
	})

	const pkgs = await pMap(packageJsons, async (pkgJsonPath) => {
		const pkgJsonAbsPath = path.resolve(repoRoot, pkgJsonPath)
		const pkgJson = PackageJson.parse(JSON.parse((await fs.readFile(pkgJsonAbsPath)).toString()))

		const dir = path.dirname(pkgJsonPath)

		return {
			name: pkgJson.name,
			path: dir,
			fullPath: path.resolve(repoRoot, dir),
			pkgJsonPath: pkgJsonAbsPath,
		}
	})

	return pkgs.sort((a, b) => a.path.localeCompare(b.path))
}

export async function getWorkspacePackage(name: string): Promise<WorkspacePackage> {
	const pkgs = await getWorkspacePackages()
	const pkg = pkgs.find((p) => p.name === name)

	if (!pkg) {
		throw new Error(`package ${name} not found`)
	}
	return pkg
}

export type WorkersProject = {
	/** package path relative to repo root */
	path: string
	/** absolute path to package */
	fullPath: string
	/** absolute path to wrangler.jsonc */
	wranglerJsoncPath: string
	/** absolute path to package.json */
	pkgJsonPath: string
}

export async function getWorkersProjects(): Promise<WorkersProject[]> {
	const repoRoot = getRepoRoot()
	const pnpmWorkspace = await getPnpmWorkspace()
	const wranglerPatterns = pnpmWorkspace.packages.map((pattern) => `${pattern}/wrangler.jsonc`)
	const wranglerJsons = await globProjectFiles(wranglerPatterns, {
		dot: true,
		ignore: ['turbo/**'],
	})

	// dedupe by fullPath in case a project has
	// both wrangler.jsonc and wrangler.json
	const uniqueWranglerJsons = new Map<string, WorkersProject>()

	await pMap(wranglerJsons, async (wranglerJson) => {
		const dir = path.dirname(wranglerJson)
		const pkgJsonPath = path.resolve(repoRoot, dir, 'package.json')

		uniqueWranglerJsons.set(path.resolve(repoRoot, dir), {
			path: dir,
			fullPath: path.resolve(repoRoot, dir),
			wranglerJsoncPath: path.resolve(repoRoot, dir, 'wrangler.jsonc'),
			pkgJsonPath,
		})
	})

	return Array.from(uniqueWranglerJsons.values()).sort((a, b) => a.path.localeCompare(b.path))
}

/**
 * Glob files in the project, ignoring files that are ignored by git.
 *
 * Note: `cwd` is always set to the repo root.
 *
 * @param patterns - glob patterns to match
 * @param options - glob options
 * @returns non-ignored files
 */
export async function globProjectFiles(
	patterns: string | string[],
	options?: Parameters<typeof glob>[1]
): Promise<string[]> {
	const repoRoot = getRepoRoot()

	const files = await glob(patterns, {
		...options,
		cwd: repoRoot,
		// this doesn't have to be perfect, but the more we ignore, the faster it is.
		ignore: [
			// wrangler
			'**/.wrangler/**',

			// astro generated types
			'**/.astro/**',

			// dependencies
			'**/node_modules/**',
			'**/.pnpm-store/**',
			'**/.pnp/**',
			'**/.pnp.js/**',

			// testing
			'**/coverage/**',

			// turbo
			'**/.turbo/**',
			'/.turbo/**',

			// build outputs
			'**/.next/**',
			'**/out/**',
			'**/dist/**',

			// debug
			'**/tmp/**',

			// git
			'**/.git/**',
			'/.git/**',

			// python
			'**/.venv/**',
			'**/__pycache__/**',
			'**/.ruff_cache/**',

			// tanstack start
			'**/.nitro/**',
			'**/.output/**',
			'**/.tanstack/**',
			...(options?.ignore ?? []),
		],
	})

	// calling git is faster than using gitignore option in glob()
	// because glob() reads all files before applying ignore patterns
	// when gitignore is used.

	const nul = '\x00'
	const res = await $({
		stdio: 'pipe',
		input: files.join(nul),
		nothrow: true,
		cwd: repoRoot,
	})`git check-ignore -z --stdin`.text()

	const ignoredFiles = new Set(res.trim().split(nul).filter(Boolean))

	return files.filter((file) => !ignoredFiles.has(file))
}
