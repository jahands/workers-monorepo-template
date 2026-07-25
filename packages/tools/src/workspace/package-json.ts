import { z } from 'zod'
import { fs } from 'zx'

/**
 * Read package.json in the current directory
 */
export async function getPackageJson(): Promise<PackageJson> {
	return PackageJson.parse(await fs.readJson('./package.json'))
}

export type PackageJson = z.infer<typeof PackageJson>
export const PackageJson = z
	.object({
		name: z.string().trim().min(1),
		version: z.string().optional(),
		main: z.string().optional(),
		private: z.boolean().optional(),
		sideEffects: z.boolean().optional(),
		type: z.enum(['module', 'commonjs']).optional(),
		scripts: z.record(z.string(), z.string()).optional(),
		dependencies: z.record(z.string(), z.string()).optional(),
		devDependencies: z.record(z.string(), z.string()).optional(),
		packageManager: z.string().optional(),
		publishConfig: z
			.object({
				registry: z.string().optional(),
			})
			.optional(),
	})
	.loose()
