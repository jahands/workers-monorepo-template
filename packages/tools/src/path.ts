import fs from 'node:fs/promises'
import * as find from 'empathic/find'
import * as pkg from 'empathic/package'
import memoizeOne from 'memoize-one'
import { z } from 'zod'
import { path } from 'zx'

/**
 * Get the absolute path to the root of the repo.
 *
 * Anchored to the location of this package (rather than cwd)
 * so that it's deterministic regardless of where it's run from.
 */
export const getRepoRoot = memoizeOne(() => {
	const absPath = z.string().trim().startsWith('/')
	const pnpmLock = absPath.endsWith('/pnpm-lock.yaml').parse(
		find.up('pnpm-lock.yaml', {
			cwd: absPath.parse(import.meta.dirname),
		})
	)
	return path.dirname(pnpmLock)
})

/**
 * Get the package name of the nearest package.json
 */
export const getPackageName = memoizeOne(async (): Promise<string> => {
	const pkgJsonPath = pkg.up()
	if (!pkgJsonPath) {
		throw new Error(`unable to locate package.json from ${process.cwd()}`)
	}
	const pkgJson = z
		.object({ name: z.string() })
		.safeParse(JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8')))
	if (!pkgJson.success) {
		throw new Error(`unable to parse package.json: ${pkgJsonPath}`)
	}
	return pkgJson.data.name
})
