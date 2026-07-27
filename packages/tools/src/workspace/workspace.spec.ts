import { describe, expect, it, test } from 'vitest'

import { getWorkersProjects, getWorkspacePackage, getWorkspacePackages } from './workspace'

describe('getWorkspacePackages()', () => {
	describe('returns packages in the workspace', async () => {
		// assert only a few packages so that we don't have
		// to update this after adding new packages
		const expectedPackages: string[] = [
			'packages/tools',
			'packages/hono-helpers',
			'apps/example-worker-echoback',
		]

		const packages = await getWorkspacePackages()

		// assert each package is present
		for (const pkg of expectedPackages) {
			test(`${pkg}`, () => {
				expect(packages.some((p) => p.path === pkg)).toBe(true)
			})
		}
	})
})

describe('getWorkersProjects()', () => {
	describe('returns workers projects in the workspace', async () => {
		const expectedProjects: string[] = ['apps/example-worker-echoback']

		const projects = await getWorkersProjects()

		// assert each project is present
		for (const project of expectedProjects) {
			test(`${project}`, () => {
				expect(projects.some((p) => p.path === project)).toBe(true)
			})
		}
	})

	describe('does not return non-workers projects', async () => {
		const nonWorkersProjects: string[] = ['packages/tools', 'packages/hono-helpers']

		const projects = await getWorkersProjects()

		for (const project of nonWorkersProjects) {
			test(`${project}`, () => {
				expect(projects.some((p) => p.path === project)).toBe(false)
			})
		}
	})
})

describe('getWorkspacePackage()', () => {
	it('gets workspace package', async () => {
		const pkg = await getWorkspacePackage('@repo/tools')

		expect(pkg.name).toBe('@repo/tools')
		expect(pkg.fullPath.endsWith('packages/tools')).toBe(true)
		expect(pkg.pkgJsonPath.endsWith('packages/tools/package.json')).toBe(true)
		expect(pkg.path).toBe('packages/tools')
	})
})
