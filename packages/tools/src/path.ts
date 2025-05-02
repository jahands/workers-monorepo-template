import * as find from 'empathic/find'
import * as pkg from 'empathic/package'
import memoizeOne from 'memoize-one'

import { z } from '@repo/zod'

export const getRepoRoot = memoizeOne(() => {
	const pnpmLock = z
		.string()
		.trim()
		.startsWith('/')
		.endsWith('/pnpm-lock.yaml')
		.parse(find.up('pnpm-lock.yaml'))
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
	const pkgJson = z.object({ name: z.string() }).safeParse(await fs.readJson(pkgJsonPath))
	if (!pkgJson.success) {
		throw new Error(`unable to parse package.json: ${pkgJsonPath}`)
	}
	return pkgJson.data.name
})
