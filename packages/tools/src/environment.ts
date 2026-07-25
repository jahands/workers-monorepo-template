import { z } from 'zod'

/**
 * Check whether we're in CI
 */
export function isCI(): boolean {
	return z.stringbool().safeParse(process.env.CI).success
}
