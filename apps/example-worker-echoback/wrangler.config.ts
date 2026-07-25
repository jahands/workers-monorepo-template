import { defineConfig } from '@repo/wrangler-config'

export default defineConfig(async (c) => ({
	...c.defaults,
	name: 'example-worker-echoback',
	main: 'src/example-worker-echoback.app.ts',
	routes: [],
	logpush: true,
	upload_source_maps: true,
	vars: {
		...c.defaults.vars,
		RELEASE: 'unknown', // overridden during deployment
	},
}))
