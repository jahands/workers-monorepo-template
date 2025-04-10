import { TypeID, typeid } from '@jahands/typeid'

import { z } from '@repo/zod'

export type TurboRunId = z.infer<typeof TurboRunId>
export const TurboRunId = z
	.custom<`turbo_run_${string}`>((id) => {
		try {
			const tid = TypeID.fromString(id)
			return tid.getType() === 'turbo_run'
		} catch {
			return false
		}
	}, 'invalid turbo_run id')
	.describe('A turbo run id we generate for our own tracking purposes (unique per run)')

export type TurboTaskId = z.infer<typeof TurboTaskId>
export const TurboTaskId = z
	.custom<`turbo_task_${string}`>((id) => {
		try {
			const tid = TypeID.fromString(id)
			return tid.getType() === 'turbo_task'
		} catch {
			return false
		}
	}, 'invalid turbo_task id')
	.describe('A turbo task run id we generate for our own tracking purposes (unique per task)')

export type TurboTask = z.infer<typeof TurboTask>
export const TurboTask = z.object({
	/** ID we generate to help ensure we have reliable ids */
	turboTaskId: TurboTaskId.default(() => NewTurboTaskId()),
	taskId: z.string(),
	task: z.string(),
	package: z.string(),
	hash: z.string(),
	inputs: z.record(z.string({ description: 'file path' }), z.string({ description: 'hash' })),
	hashOfExternalDependencies: z.string(),
	cache: z.object({
		local: z.boolean(),
		remote: z.boolean(),
		status: z.enum(['HIT', 'MISS']),
		source: z.enum(['LOCAL', 'REMOTE']).optional(),
		timeSaved: z.number(),
	}),
	command: z.string(),
	cliArguments: z.string().array(),
	outputs: z.string().array().nullable(),
	excludedOutputs: z.string().array().nullable(),
	logFile: z.string().optional(),
	directory: z.string(),
	dependencies: z.string().array(),
	dependents: z.string().array(),
	resolvedTaskDefinition: z.object({
		outputs: z.string().array(),
		cache: z.boolean(),
		dependsOn: z.string().array(),
		inputs: z.string().array(),
		outputLogs: z.string(),
		persistent: z.boolean(),
		interruptible: z.boolean(),
		env: z.string().array(),
		passThroughEnv: z.string().array().nullable(),
		interactive: z.boolean(),
	}),
	expandedOutputs: z.string().array(),
	framework: z.string(),
	envMode: z.string(),
	environmentVariables: z.object({
		specified: z.object({
			env: z.string().array(),
			passThroughEnv: z.string().array().nullable(),
		}),
		configured: z.string().array(),
		inferred: z.string().array(),
		passthrough: z.string().array().nullable(),
	}),
	execution: z.object({
		startTime: z.number(),
		endTime: z.number(),
		exitCode: z.number(),
		error: z.string().optional(),
	}),
})

export type TurboSummaryFile = z.infer<typeof TurboSummaryFile>
export const TurboSummaryFile = z.object({
	/** ID we generate to help ensure we have reliable ids */
	turboRunId: TurboRunId.default(() => NewTurboRunId()),
	id: z.string(),
	version: z.literal('1'),
	turboVersion: z.string(),
	monorepo: z.boolean(),
	globalCacheInputs: z.object({
		rootKey: z.string(),
		files: z.record(z.string({ description: 'file path' }), z.string({ description: 'hash' })),
		hashOfExternalDependencies: z.string(),
		hashOfInternalDependencies: z.string(),
		environmentVariables: z.object({
			specified: z.object({
				env: z.string().array(),
				passThroughEnv: z.string().array(),
			}),
			configured: z.string().array(),
			inferred: z.string().array(),
			passthrough: z.string().array(),
		}),
		engines: z.null(),
	}),
	execution: z.object({
		command: z.string(),
		repoPath: z.string(),
		success: z.number(),
		failed: z.number(),
		cached: z.number(),
		attempted: z.number(),
		startTime: z.number(),
		endTime: z.number(),
		exitCode: z.number(),
	}),
	packages: z.string().array(),
	envMode: z.string(),
	frameworkInference: z.boolean(),
	tasks: TurboTask.array(),
	user: z.string(),
	scm: z.object({
		type: z.string(),
		sha: z.string().nullable().describe('null when run with no .git directory (e.g. in CI)'),
		branch: z.string().nullable().describe('null when run with no .git directory (e.g. in CI)'),
	}),
})

export type TurboEnv = z.infer<typeof TurboEnv>
export const TurboEnv = z
	.enum(['local', 'ci'])
	.describe('environment that turbo is running in so that we can filter on tasks run in CI')

export type TurboRepoName = z.infer<typeof TurboRepoName>
export const TurboRepoName = z.enum(['workers_monorepo'])

/**
 * Generate a turbo run id so that we can
 * identify logs from the same run
 */
export function NewTurboRunId(): TurboRunId {
	return TurboRunId.parse(typeid('turbo_run').toString())
}

/**
 * Generate a turbo task id so that we can identify tasks
 */
export function NewTurboTaskId(): TurboTaskId {
	return TurboTaskId.parse(typeid('turbo_task').toString())
}

/**
 * GitHubEnv contains various environment variables
 * found within GitHub Actions.
 *
 * Example: https://gist.uuid.rocks/jh/0ce350594b434567a632815604d3dac6
 */
export type GitHubActionsEnv = z.infer<typeof GitHubActionsEnv>
export const GitHubActionsEnv = z.object({
	CI: z.coerce.boolean().optional(),
	GITHUB_ACTION_REF: z.string().optional(),
	GITHUB_ACTION_REPOSITORY: z.string().optional(),
	GITHUB_ACTION: z.string().optional(),
	GITHUB_ACTIONS: z.coerce.boolean().optional(),
	GITHUB_ACTOR_ID: z.coerce.number().min(1).optional(),
	GITHUB_ACTOR: z.string().optional(),
	GITHUB_BASE_REF: z.string().optional(),
	GITHUB_EVENT_NAME: z.string().optional(),
	GITHUB_HEAD_REF: z.string().optional(),
	GITHUB_JOB: z.string().optional(),
	GITHUB_REF_NAME: z.string().optional(),
	GITHUB_REF_PROTECTED: z.coerce.boolean().optional(),
	GITHUB_REF_TYPE: z.string().optional(),
	GITHUB_REF: z.string().optional(),
	GITHUB_REPOSITORY_ID: z.coerce.number().min(1).optional(),
	GITHUB_REPOSITORY_OWNER_ID: z.coerce.number().min(1).optional(),
	GITHUB_REPOSITORY_OWNER: z.string().optional(),
	GITHUB_REPOSITORY: z.string().optional(),
	GITHUB_RUN_ATTEMPT: z.coerce.number().min(1).optional(),
	GITHUB_RUN_ID: z.coerce.number().min(1).optional(),
	GITHUB_RUN_NUMBER: z.coerce.number().min(1).optional(),
	GITHUB_SHA: z.string().optional(),
	GITHUB_TRIGGERING_ACTOR: z.string().optional(),
	GITHUB_WORKFLOW_REF: z.string().optional(),
	GITHUB_WORKFLOW_SHA: z.string().optional(),
	GITHUB_WORKFLOW: z.string().optional(),
	INVOCATION_ID: z.string().optional(),
	RUNNER_ARCH: z.string().optional(),
	RUNNER_ENVIRONMENT: z.string().optional(),
	RUNNER_NAME: z.string().optional(),
	RUNNER_OS: z.string().optional(),
	RUNNER_TRACKING_ID: z.string().optional(),
})

export type SystemInfo = z.infer<typeof SystemInfo>
export const SystemInfo = z.object({
	hostname: z.string(),
	arch: z
		.string()
		.describe(
			'Returns the operating system CPU architecture for which the Node.js binary was compiled'
		),
	platform: z.string(),
	version: z.string({ description: 'a string identifying the kernel version.' }),
	machine: z.string({
		description: 'the machine type as returend by uname(3). e.g. arm, arm64, aarch64, etc.',
	}),
	type: z.string({
		description: `the operating system name as returend by uname(3). e.g. 'Linux', 'Darwin', etc.`,
	}),
	release: z.string({ description: 'the operating system as a string' }),
	uptime: z.number({ description: 'uptime in seconds' }),
	cpus: z.array(
		z.object({
			speed: z.number(),
			model: z.string(),
			times: z.object({
				user: z.number(),
				nice: z.number(),
				sys: z.number(),
				idle: z.number(),
				irq: z.number(),
			}),
		})
	),
	memory: z.object({
		free: z.number({ description: 'total amount of system memory in bytes as an integer' }),
		total: z.number({ description: 'total amount of system memory in bytes as an integer' }),
	}),
	availableParallelism: z.number(),
	loadavg: z
		.number()
		.array()
		.describe('an array containing the 1, 5, and 15 minute load averages.'),
})

export type TurboSummaryRequest = z.infer<typeof TurboSummaryRequest>
export const TurboSummaryRequest = z.object({
	turboEnv: TurboEnv,
	/** Repo that the task is being run in */
	repoName: TurboRepoName,
	turboRunId: TurboRunId,
	turboSummaryFile: TurboSummaryFile,
	githubActionsEnv: GitHubActionsEnv.nullable(),
	system: SystemInfo,
})
