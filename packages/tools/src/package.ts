import { z } from '@repo/zod'

/**
 * Some packages include sourcemaps in their assets that
 * should be removed before deploy (e.g. orange-js)
 */
export async function shouldRemoveSourcemapsBeforeDeploy(): Promise<boolean> {
	return (await Promise.all([isOrangeJsProject()])).some((v) => v === true)
}

/**
 * Check if package.json includes orange-js framework
 */
export async function isOrangeJsProject(): Promise<boolean> {
	const pkgJson = PackageJson.parse(await Bun.file('./package.json').json())
	return (
		pkgJson.dependencies?.['@orange-js/orange'] !== undefined ||
		pkgJson.devDependencies?.['@orange-js/orange'] !== undefined
	)
}

export type PackageJson = z.infer<typeof PackageJson>
export const PackageJson = z.object({
	name: z.string(),
	version: z.string(),
	private: z.boolean().optional(),
	sideEffects: z.boolean().optional(),
	scripts: z.record(z.string(), z.string()),
	dependencies: z.record(z.string(), z.string()).optional(),
	devDependencies: z.record(z.string(), z.string()).optional(),
})
