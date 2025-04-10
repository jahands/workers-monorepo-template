import { parse as parseDotenv } from '@dotenvx/dotenvx'
import { isNotFoundError } from '@jahands/cli-tools'
import * as Sentry from '@sentry/bun'

import { GitHubActionsEnv } from '@repo/tools-schema/turbo.schema'

export async function getGitHubActionsEnv(envPath: string): Promise<GitHubActionsEnv | null> {
	try {
		const envText = (await fs.readFile(envPath)).toString()

		Sentry.getCurrentScope().addAttachment({
			filename: 'parsed_github_env.txt',
			data: envText,
			contentType: 'text/plain',
		})

		const env = parseDotenv(envText)
		return GitHubActionsEnv.parse(env)
	} catch (e) {
		if (isNotFoundError(e)) {
			return null
		} else {
			Sentry.captureException(e)
			return null
		}
	}
}
