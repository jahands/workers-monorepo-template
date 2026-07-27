export function getOutcome({
	exitCode,
	skippedCode,
}: {
	exitCode: number | null
	skippedCode?: number
}) {
	if (exitCode === 0) {
		return chalk.green('Success!')
	} else if (exitCode === skippedCode) {
		return chalk.yellow('Skipped')
	} else {
		return chalk.red(`Failed with code: ${exitCode}`)
	}
}

/**
 * Non-zero exit code used to indicate "skipped due to shfmt/rg unavailable"
 */
export const SHFMT_SKIPPED_EXIT_CODE = 113

/**
 * Stable prettier cache location (relative to the repo root)
 * so that it can be cached (e.g. by turbo) across runs.
 */
export const PRETTIER_CACHE_LOCATION = 'node_modules/.cache/.prettier/.prettier-cache'
