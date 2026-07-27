import { describe, expect, it } from 'vitest'

import { packageDestination } from './package-destination'

describe('packageDestination', () => {
	it('uses the packages directory when run from the workspace root', () => {
		expect(
			packageDestination(
				{
					cwd: '/workspace',
					root: '/workspace',
					workspace: '/workspace',
				},
				'example'
			)
		).toBe('packages/example')
	})

	it('uses the fallback directory when run from the workspace root', () => {
		expect(
			packageDestination(
				{
					cwd: '/workspace',
					root: '/workspace',
					workspace: '/workspace',
				},
				'example',
				'apps'
			)
		).toBe('apps/example')
	})

	it('uses the current directory when run below the workspace root', () => {
		expect(
			packageDestination(
				{
					cwd: '/workspace/apps/my-team',
					root: '/workspace',
					workspace: '/workspace',
				},
				'example'
			)
		).toBe('apps/my-team/example')
	})
})
