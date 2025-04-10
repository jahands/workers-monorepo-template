import { describe, expect, it } from 'vitest'

import { getGitHubActionsEnv } from './github'

describe('getGitHubEnv()', () => {
	const fixtureDir = `${__dirname}/test/fixtures/github`
	const fixture = (n: string) => `${fixtureDir}/${n}`

	it('returns null if file does not exist', async () => {
		await expect(getGitHubActionsEnv('path/does/not/exist')).resolves.toBe(null)
	})

	it('returns all valid vars', async () => {
		await expect(getGitHubActionsEnv(fixture('all_valid.txt'))).resolves.toStrictEqual({
			CI: true,
			GITHUB_ACTION: '__run',
			GITHUB_ACTIONS: true,
			GITHUB_ACTION_REF: '',
			GITHUB_ACTION_REPOSITORY: '',
			GITHUB_ACTOR: 'jahands',
			GITHUB_ACTOR_ID: 10719325,
			GITHUB_BASE_REF: '',
			GITHUB_EVENT_NAME: 'push',
			GITHUB_HEAD_REF: '',
			GITHUB_JOB: 'check',
			GITHUB_REF: 'refs/heads/citest',
			GITHUB_REF_NAME: 'citest',
			GITHUB_REF_PROTECTED: true,
			GITHUB_REF_TYPE: 'branch',
			GITHUB_REPOSITORY: 'uuid-rocks/workers-monorepo',
			GITHUB_REPOSITORY_ID: 745506211,
			GITHUB_REPOSITORY_OWNER: 'uuid-rocks',
			GITHUB_REPOSITORY_OWNER_ID: 129391857,
			GITHUB_RUN_ATTEMPT: 1,
			GITHUB_RUN_ID: 13740436235,
			GITHUB_RUN_NUMBER: 76,
			GITHUB_SHA: 'fb7b247bf6e67522555ac43798a69dd3ac85b60f',
			GITHUB_TRIGGERING_ACTOR: 'jahands',
			GITHUB_WORKFLOW: 'Branches',
			GITHUB_WORKFLOW_REF:
				'uuid-rocks/workers-monorepo/.github/workflows/branches.yml@refs/heads/citest',
			GITHUB_WORKFLOW_SHA: 'fb7b247bf6e67522555ac43798a69dd3ac85b60f',
			INVOCATION_ID: '574ea0ea95a045109e6ec7a92f5f9027',
			RUNNER_ARCH: 'X64',
			RUNNER_ENVIRONMENT: 'github-hosted',
			RUNNER_NAME: 'GitHub Actions 19',
			RUNNER_OS: 'Linux',
			RUNNER_TRACKING_ID: 'github_52159600-b3f4-4104-b11d-c1f8b40ec435',
		})
	})

	it('returns partial valid vars', async () => {
		await expect(getGitHubActionsEnv(fixture('partial_valid.txt'))).resolves.toStrictEqual({
			CI: true,
			GITHUB_REPOSITORY_OWNER: 'uuid-rocks',
			GITHUB_REPOSITORY_OWNER_ID: 129391857,
		})
	})

	it('ignores unknown vars', async () => {
		await expect(
			getGitHubActionsEnv(fixture('partial_with_unknown_vars.txt'))
		).resolves.toStrictEqual({
			CI: true,
			GITHUB_REPOSITORY_OWNER: 'uuid-rocks',
			GITHUB_REPOSITORY_OWNER_ID: 129391857,
		})
	})

	it('returns empty object for empty file', async () => {
		await expect(getGitHubActionsEnv(fixture('empty.txt'))).resolves.toStrictEqual({})
	})
})
