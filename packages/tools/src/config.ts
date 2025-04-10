import { z } from '@repo/zod'

import { getRepoRoot } from './path'

export async function getConfig() {
	const repoRoot = getRepoRoot()
	const version = (await $`bun get-version`.text()).trim()
	return Config.parse({ repoRoot, version } satisfies Config)
}

export type Config = z.infer<typeof Config>
export const Config = z.object({
	repoRoot: z.string().startsWith('/').min(2),
	version: z
		.string()
		.regex(/^\d+\.\d+\.\d+-[\da-f]{7,12}$/, 'e.g. 0.11.4-90e37d2a')
		.describe('release version'),
})
