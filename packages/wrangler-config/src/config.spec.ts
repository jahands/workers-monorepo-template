import { describe, expect, it } from 'vitest'

import { defineConfig } from './config'
import { CloudchamberConfig, WranglerConfig } from './schema'

describe('defineConfig', () => {
	it('passes shared wranglerContext into callback', async () => {
		const config = await defineConfig(async (c) => ({
			...c.defaults,
			name: 'test-worker',
			main: './src/index.ts',
			compatibility_date: '2026-01-01',
		}))

		expect(config.workers_dev).toBe(false)
		expect(config.placement?.mode).toBe('smart')
	})

	it('fills workflow binding and class names from name', async () => {
		const config = await defineConfig(async (c) => ({
			...c.defaults,
			name: 'test-worker',
			main: './src/index.ts',
			compatibility_date: '2026-01-01',
			workflows: [
				{
					name: 'TestWorkflow',
					schedules: ['30 13 * * *'],
				},
				{
					name: 'Test_DisplayName',
					binding: 'TestBinding',
					class_name: 'TestClass',
				},
			],
		}))

		expect(config.workflows).toStrictEqual([
			{
				binding: 'TestWorkflow',
				class_name: 'TestWorkflow',
				name: 'TestWorkflow',
				schedules: ['30 13 * * *'],
			},
			{
				binding: 'TestBinding',
				class_name: 'TestClass',
				name: 'Test_DisplayName',
			},
		])
	})

	it('sets vars.NAME from name when missing', async () => {
		const config = await defineConfig(async (c) => ({
			...c.defaults,
			name: 'derived-name',
			main: './src/index.ts',
			compatibility_date: '2026-01-01',
		}))

		expect(config.vars?.NAME).toBe('derived-name')
	})

	it('does not materialize optional defaults', async () => {
		const config = await defineConfig(async (c) => ({
			...c.defaults,
			name: 'test-worker',
			main: './src/index.ts',
			compatibility_date: '2026-01-01',
		}))

		expect(config).toMatchInlineSnapshot(`
			{
			  "$schema": "node_modules/wrangler/config-schema.json",
			  "compatibility_date": "2026-01-01",
			  "compatibility_flags": [
			    "nodejs_compat",
			  ],
			  "main": "./src/index.ts",
			  "name": "test-worker",
			  "observability": {
			    "logs": {
			      "enabled": true,
			      "head_sampling_rate": 1,
			    },
			  },
			  "placement": {
			    "mode": "smart",
			  },
			  "preview_urls": false,
			  "vars": {
			    "ENVIRONMENT": "development",
			    "NAME": "test-worker",
			  },
			  "version_metadata": {
			    "binding": "CF_VERSION_METADATA",
			  },
			  "workers_dev": false,
			}
		`)

		expect(config).not.toHaveProperty('build')
		expect(config).not.toHaveProperty('queues')
		expect(config).not.toHaveProperty('triggers')
		expect(config.observability?.logs).not.toHaveProperty('persist')
	})

	it('still validates invalid values', async () => {
		await expect(
			defineConfig(
				async (_c) =>
					({
						workers_dev: 'nope',
					}) as unknown as WranglerConfig
			)
		).rejects.toThrowError(/Invalid wrangler\.config\.ts/)
	})

	it('errors when name is missing', async () => {
		await expect(
			defineConfig(async (c) => ({
				...c.defaults,
				main: './src/index.ts',
				compatibility_date: '2026-01-01',
			}))
		).rejects.toThrowError(/"name" must be set/)
	})

	it('orders top-level keys to match wrangler.jsonc conventions', async () => {
		const config = await defineConfig(async (c) => ({
			...c.defaults,
			name: 'ordered-worker',
			account_id: 'account-id',
			main: './src/index.ts',
			compatibility_date: '2026-01-01',
			compatibility_flags: ['nodejs_compat'],
			preview_urls: false,
			logpush: true,
			routes: ['example.com/*'],
			assets: {
				directory: './dist',
				binding: 'ASSETS',
			},
			observability: {
				logs: {
					enabled: true,
					head_sampling_rate: 1,
				},
			},
			placement: {
				mode: 'off',
			},
			tail_consumers: [{ service: 'tail-worker' }],
			vars: {
				NAME: 'ordered-worker',
			},
			version_metadata: {
				binding: 'CF_VERSION_METADATA',
			},
		}))

		expect(Object.keys(config)).toEqual([
			'$schema',
			'name',
			'account_id',
			'main',
			'compatibility_date',
			'compatibility_flags',
			'workers_dev',
			'preview_urls',
			'logpush',
			'routes',
			'assets',
			'observability',
			'placement',
			'tail_consumers',
			'vars',
			'version_metadata',
		])
	})

	it('includes schema defaults in description metadata', () => {
		expect(WranglerConfig.shape.preview_urls.description).toContain('Default: false')
		expect(WranglerConfig.shape.workers_dev.description).toContain('Default: true')
	})

	it('adds synthetic descriptions when source descriptions are missing', () => {
		expect(CloudchamberConfig.shape.instance_type.description).toContain('Allowed values: "dev"')
		expect(CloudchamberConfig.shape.image.description).toBe('Type: string')
	})
})
