import 'zx/globals'

import { program } from '@commander-js/extra-typings'
import * as Sentry from '@sentry/bun'
import memoizeOne from 'memoize-one'

import { TurboSummaryFile, TurboSummaryRequest } from '@repo/tools-schema/turbo.schema'
import { z, ZodError } from '@repo/zod'

import { getGitHubActionsEnv } from '../github'
import { getMetricsToken } from '../metrics'
import { getRepoRoot } from '../path'
import { timeFn } from '../time'

import type { TurboEnv } from '@repo/tools-schema/turbo.schema'

/** note: `.github_actions.env` comes from the GHA workflow that creates this file */
const getGHAEnv = memoizeOne(() => getGitHubActionsEnv(`${getRepoRoot()}/.github_actions.env`))

const getTurboEnv = memoizeOne(async (): Promise<TurboEnv> => {
	if ((await getGHAEnv())?.CI) {
		return 'ci'
	}
	return 'local'
})

const getGitSha = memoizeOne(async (): Promise<string> => {
	try {
		return await $`bun get-git-sha`.quiet().text()
	} catch {
		return (await getGHAEnv())?.GITHUB_REF || 'unknown'
	}
})

Sentry.init({
	dsn: 'https://ab6337fa1a12f3b07808388869e9c87d@sentry.uuid.rocks/71',
	tracesSampleRate: 1.0,
	environment: await getTurboEnv(),
	release: await getGitSha(),
})

program
	.name('turbox')
	.description('Run turbo and send summary to Axiom via ingester')
	.argument('<args...>')
	.action(async (args) => {
		const token = getMetricsToken()
		if (token) {
			void fetch('https://ingest.uuid.rocks/api/ping')
			void fetch('https://sentry.uuid.rocks/api/ping')
		}

		let capturedOutput = ''

		// Run the turbo command and then send metrics
		try {
			const textDecoder = new TextDecoder()
			const proc = $({
				stdio: 'pipe',
			})`FORCE_COLOR=1 turbo --summarize=true ${args}`
			for await (const chunk of proc.stdout) {
				process.stdout.write(chunk)
				capturedOutput += textDecoder.decode(chunk)
			}
			await proc
		} finally {
			await sendTurboLogMetrics({ token, capturedOutput }).catch((e) => {
				console.error('error_send_turbo_metrics_failed', e)
				Sentry.captureException(e)
			})
		}
	})

	// Don't hang for unresolved promises
	.hook('postAction', async () => {
		await timeFn('flush sentry', Sentry.flush)()
		process.exit(0)
	})
	.parseAsync()
	.catch(async (e) => {
		if (e instanceof ProcessOutput) {
			process.exit(1)
		} else {
			Sentry.captureException(e)
			await timeFn('flush sentry', Sentry.flush)()
			throw e
		}
	})

async function sendTurboLogMetrics({
	token,
	capturedOutput,
}: {
	token: string | null
	capturedOutput: string
}): Promise<void> {
	if (!token) return // metrics disabled

	const turboEnv = await getTurboEnv()
	Sentry.setTag('turbo_env', turboEnv)

	const summaryRegex = /\/\.turbo\/runs\/[\w\d]+\.json$/
	const maybeTurboSummaryPath = stripAnsiCodes(capturedOutput)
		.trim()
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.toLowerCase().startsWith('summary:'))
		.findLast((l) => summaryRegex.test(l))
		?.split('Summary:')[1]
		.trim()

	if (!maybeTurboSummaryPath) {
		throw new Error('no turbo summary path found in turbo output')
	}

	// Last line contains something like:
	// Summary:    /Users/jh/src/workers/.turbo/runs/2tluOyqnHGm2siVU7Q1J28KU3Gv.json
	const turboSummaryPath = z
		.string()
		.trim()
		// e.g. /Users/jh/src/workers/.turbo/runs/2tjlIYzW33LlnBUAqzpJw1350lk.json
		.regex(summaryRegex)
		.parse(maybeTurboSummaryPath)

	// example summary: https://gist.uuid.rocks/jh/7e74d77d3c8a488fb5ea1bec2c7259da
	const turboSummaryJson = await Bun.file(turboSummaryPath).text()
	Sentry.getCurrentScope().addAttachment({
		filename: 'turbo_summary.json',
		data: turboSummaryJson,
	})

	const turboSummaryFileJson = JSON.parse(turboSummaryJson)

	// Try to strict parse so that we learn about new fields via Sentry
	try {
		z.deepStrict(TurboSummaryFile).parse(turboSummaryFileJson)
	} catch (e) {
		console.error('TurboSummaryFile fialed to strict parse file', e)
		Sentry.withScope((scope) => {
			scope.addAttachment({
				filename: 'turbo_summary_file.json',
				data: JSON.stringify(turboSummaryFileJson),
			})
			if (e instanceof ZodError) {
				scope.addAttachment({
					filename: 'turbo_strict_parse_error.json',
					data: JSON.stringify({
						issuesFlattened: e.flatten(),
						issues: e.issues,
					}),
				})
				scope.setContext('turbo summary file parse error', {
					errorMessage: e.message,
				})
				scope.captureException(new Error('TurboSummaryFile failed to strict parse file'))
			} else {
				scope.captureException(e)
			}
		})
	}

	// Now parse it normally
	const turboSummaryFile = TurboSummaryFile.parse(turboSummaryFileJson)
	const githubActionsEnv = await getGHAEnv()

	const cpus = os.cpus()
	const body = JSON.stringify(
		TurboSummaryRequest.parse({
			turboEnv,
			repoName: 'workers_monorepo',
			turboRunId: turboSummaryFile.turboRunId,
			turboSummaryFile,
			githubActionsEnv,
			system: {
				hostname: os.hostname(),
				arch: os.arch(),
				platform: os.platform(),
				version: os.version(),
				machine: os.machine(),
				type: os.type(),
				release: os.release(),
				cpus,
				memory: {
					free: os.freemem(),
					total: os.totalmem(),
				},
				uptime: os.uptime(),
				availableParallelism: os.availableParallelism(),
				loadavg: os.loadavg(),
			},
		} satisfies TurboSummaryRequest)
	)

	const label = `sent turbo metrics (length: ${body.length})`
	console.time(label)
	const res = await fetch(
		`https://ingest.uuid.rocks/api/ingest/ci/turbo?turboRunId=${turboSummaryFile.turboRunId}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body,
		}
	)
	console.timeEnd(label)

	if (!res.ok) {
		console.error(
			'error_send_turbo_metrics_failed',
			`failed to send: ${res.status} - ${await res.text()}`
		)
	}
}

/**
 * Strips ANSI color codes from a string
 */
function stripAnsiCodes(str: string): string {
	// This regex matches ANSI escape sequences for colors and formatting
	// Using a string pattern to avoid linter issues with control characters
	return str.replace(
		new RegExp('\u001B' + '\\[\\d+(?:;\\d+)*m|' + '\u001B' + '\\[\\d*[JKmsu]', 'g'),
		''
	)
}
