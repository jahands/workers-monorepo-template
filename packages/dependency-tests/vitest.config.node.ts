import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		name: 'dependency-tests-node',
		environment: 'node',
	},
})
