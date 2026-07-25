import { defineConfig, pMap } from 'turbo-config'

import { PackageJson } from '@repo/tools/package'
import { getWorkspacePackages } from '@repo/tools/workspace'

import type { z } from '@repo/workspace-dependencies/zod'

export default defineConfig(async () => {
	const packages = await getWorkspacePackages()

	const packageJsons = await pMap(packages, (pkg) => readJsonFile(PackageJson, pkg.pkgJsonPath))

	// packages that need to be built before running commands in root
	const buildPackages = packageJsons
		.flatMap((pkg) => {
			// we need to build all packages before linting/testing from
			// the root due to some files importing from built files
			const deps: string[] = []
			if (pkg.scripts?.build) {
				deps.push(`${pkg.name}#build`)
			}
			return deps
		})
		.sort()

	return {
		globalDependencies: ['**/.dev.vars'],
		globalEnv: ['CI', 'GITHUB_ACTIONS', 'VITEST'],
		globalPassThroughEnv: ['WRANGLER_LOG', 'FORCE_COLOR'],
		remoteCache: {
			// Enable if using Turbo Remote Cache
			enabled: false,
			signature: true,
		},
		ui: 'stream',
		tasks: {
			topo: {
				dependsOn: ['^topo'],
			},
			build: {
				dependsOn: ['^build', 'build:wrangler-config', 'topo'],
				outputs: ['dist/**', '.wrangler/deploy/config.json'],
				outputLogs: 'new-only',
			},
			// generates wrangler.jsonc from wrangler.config.ts (and
			// checks that it's up to date when running in CI)
			'build:wrangler-config': {
				dependsOn: ['topo'],
				outputs: ['wrangler.jsonc'],
				outputLogs: 'new-only',
			},
			dev: {
				cache: false,
				dependsOn: ['build', 'topo'],
				interactive: true,
				persistent: true,
				outputLogs: 'new-only',
			},
			// preview is used in Vite applications
			preview: {
				cache: false,
				dependsOn: ['build', 'topo'],
				interactive: true,
				persistent: true,
				outputLogs: 'new-only',
			},
			deploy: {
				cache: false,
				dependsOn: ['build', 'topo'],
				env: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
				outputLogs: 'new-only',
			},
			// build:wrangler isn't used much, but can be useful for debugging
			'build:wrangler': {
				dependsOn: ['build', 'topo'],
				outputLogs: 'new-only',
			},
			check: {
				dependsOn: ['check:types', 'check:workers-types', 'check:lint', 'topo'],
				outputLogs: 'new-only',
			},
			'//#test:ci': {
				// all workspace packages with a build script need to be
				// built before running tests from the root
				dependsOn: ['build', ...buildPackages],
				outputLogs: 'new-only',
			},
			'test:ci': {
				dependsOn: ['build', 'topo'],
				outputLogs: 'new-only',
			},
			'check:ci': {
				dependsOn: [
					'//#check:turbo-config',
					'//#check:format',
					'//#check:deps',
					'check:types',
					'check:workers-types',
					'//#check:lint:all',
					'//#test:ci',
					'test:ci',
					'topo',
				],
				outputLogs: 'new-only',
			},
			'//#check:turbo-config': {
				outputLogs: 'new-only',
			},
			'//#check:deps': {
				outputLogs: 'new-only',
			},
			'check:types': {
				dependsOn: ['build', 'topo'],
				outputLogs: 'new-only',
			},
			'check:lint': {
				dependsOn: ['build', 'topo'],
				outputLogs: 'new-only',
			},
			'check:workers-types': {
				dependsOn: ['build', 'topo'],
				outputLogs: 'new-only',
			},
			'//#check:lint:all': {
				// all workspace packages with a build script need to be
				// built before linting from the root
				dependsOn: buildPackages,
				outputLogs: 'new-only',
			},
			'//#check:format': {
				dependsOn: [],
				outputs: ['node_modules/.cache/.prettier/.prettier-cache'],
				outputLogs: 'new-only',
			},
			'fix:workers-types': {
				dependsOn: ['topo'],
				outputs: ['worker-configuration.d.ts'],
				outputLogs: 'new-only',
			},
			'fix:format': {
				dependsOn: ['topo'],
				outputs: ['node_modules/.cache/.prettier/.prettier-cache'],
				outputLogs: 'new-only',
			},
			'//#build': {
				dependsOn: ['^build'],
				outputLogs: 'new-only',
			},
		},
	}
})

async function readFile(path: string): Promise<string> {
	// @ts-expect-error - No bun types in root
	return Bun.file(path).text()
}

async function readJsonFile<T>(schema: z.ZodType<T>, path: string): Promise<T> {
	return schema.parse(JSON.parse(await readFile(path)))
}
