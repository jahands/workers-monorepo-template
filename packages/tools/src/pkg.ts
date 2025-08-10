import { z } from 'zod/v4'

/**
 * Represents a pakcage.json file
 */
export const PackageJson = z.object({
	name: z.string().optional(),
	version: z.string().optional(),
	description: z.string().optional(),
	type: z.enum(['module', 'commonjs']).optional(),
	module: z.string().optional(),
	main: z.string().optional(),
	types: z.string().optional(),
	scripts: z.record(z.string(), z.string()).optional(),
	dependencies: z.record(z.string(), z.string()).optional(),
	devDependencies: z.record(z.string(), z.string()).optional(),
	peerDependencies: z.record(z.string(), z.string()).optional(),
	optionalDependencies: z.record(z.string(), z.string()).optional(),
	packageManager: z.string().optional(),
	engines: z
		.object({
			node: z.string().optional(),
			npm: z.string().optional(),
			pnpm: z.string().optional(),
		})
		.optional(),
	repository: z
		.union([
			z.string(),
			z.object({
				type: z.string(),
				url: z.string(),
			}),
		])
		.optional(),
	keywords: z.array(z.string()).optional(),
	author: z
		.union([
			z.string(),
			z.object({
				name: z.string(),
				email: z.string().optional(),
				url: z.string().optional(),
			}),
		])
		.optional(),
	license: z.string().optional(),
	bugs: z
		.union([
			z.string(),
			z.object({
				url: z.string().optional(),
				email: z.string().optional(),
			}),
		])
		.optional(),
	homepage: z.string().optional(),
	private: z.boolean().optional(),
	publishConfig: z.record(z.string(), z.unknown()).optional(),
	workspaces: z.array(z.string()).optional(),
})

export type PackageJson = z.infer<typeof PackageJson>
