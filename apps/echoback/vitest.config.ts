import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject({
	test: {
		setupFiles: [`${__dirname}/src/test/setup.ts`],
		deps: {
			optimizer: {
				ssr: {
					enabled: true,
					include: [],
				},
			},
		},
		poolOptions: {
			workers: {
				wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
				miniflare: {
					bindings: {
						ENVIRONMENT: 'VITEST',
					},
				},
			},
		},
	},
})
