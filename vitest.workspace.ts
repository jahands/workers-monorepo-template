import { defineWorkspace } from 'vitest/config'

import { glob } from '@repo/workspace-dependencies/zx'

const projects = await glob([
	// All vitest projects
	'{apps,apps2,bunapps,docker,packages}/*/vitest.config{,.node}.ts',
	'1projects/*/*/vitest.config{,.node}.ts',
	'1projects/*/{1apps,1packages}/*/vitest.config{,.node}.ts',
])

const isolated: string[] = [
	// This require running vitest separately for some reason
	'1projects/cf-wci/wci-tracker/vitest.config.ts',

	// Inconsistent results between Node and Workers when running tests from root
	'1projects/countify/permissible/vitest.config.ts',
	'1projects/countify/permissible/vitest.config.node.ts',

	// This app requires specific env so needs to run separately
	'bunapps/cronjobs/vitest.config.ts',
]

export default defineWorkspace([
	// Run all non-isolated projects together.
	...projects.filter((p) => !isolated.includes(p)),
])
