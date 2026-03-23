import { defineConfig, getConfig } from '@repo/oxlint-config'

const config = getConfig()

export default defineConfig({
	...config,
	// Add overrides as needed here
})
