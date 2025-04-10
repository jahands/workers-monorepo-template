import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject({
	test: {
		deps: {
			optimizer: {
				ssr: {
					enabled: true,
					include: ['@repo/otel'],
				},
			},
		},
		poolOptions: {
			workers: {
				isolatedStorage: true,
				singleWorker: true,
				miniflare: {
					compatibilityDate: '2025-03-12',
					compatibilityFlags: ['nodejs_compat'],
					bindings: {
						ENVIRONMENT: 'VITEST',
					},
				},
			},
		},
	},
})
