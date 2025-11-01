import { defineConfig } from 'vitest/config'

import { glob } from '@repo/workspace-dependencies/zx'

export default defineConfig(async () => {
	const cfgTs = 'vitest.config{,.node}.ts'

	// all vitest projects
	const projectConfigPaths = await glob([`{apps,packages}/*/${cfgTs}`, `turbo/generators/${cfgTs}`])

	return {
		test: {
			projects: projectConfigPaths,
		},
	}
})
