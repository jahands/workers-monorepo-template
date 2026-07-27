import { expect } from 'vitest'
import * as z from 'zod'

import type { ExpectationResult } from 'vitest'

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
	interface ExpectationResult {
		pass: boolean
		message: () => string
		// If you pass these, they will automatically appear inside a diff when
		// the matcher does not pass, so you don't need to print the diff yourself
		actual?: unknown
		expected?: unknown
	}
}

export interface CustomMatchers<_R = unknown> {
	toBeUUID: () => void
	toBeGreaterThan: (expected: number | bigint) => void
	toBeAfterDate: (expected: string) => void
}

expect.extend({
	toBeUUID(received: unknown): ExpectationResult {
		const { isNot } = this
		return {
			pass: z.uuid().safeParse(received).success,
			message: () => `expected "${String(received)}" ${isNot ? 'not ' : ''}to be a valid UUID`,
		}
	},

	/**
	 * Unlike the built-in matcher, this fails instead of throwing when
	 * the received value isn't a number.
	 */
	toBeGreaterThan(received: unknown, expected: number): ExpectationResult {
		const { isNot } = this
		return {
			pass: typeof received === 'number' && received > expected,
			message: () =>
				`expected "${String(received)}" ${isNot ? 'not ' : ''}to be greater than ${expected}`,
		}
	},

	toBeAfterDate(received: unknown, expected: string): ExpectationResult {
		const { isNot } = this
		const rec = z.coerce.date().safeParse(received)
		const exp = z.coerce.date().safeParse(expected)
		if (rec.success && exp.success) {
			return {
				pass: rec.data.getTime() > exp.data.getTime(),
				message: () =>
					`expected ${rec.data.toISOString()} ${isNot ? 'not ' : ''}to be after ${exp.data.toISOString()}`,
			}
		}

		return {
			pass: false,
			message: () => `expected "${String(received)}" ${isNot ? 'not ' : ''}to be after ${expected}`,
		}
	},
})
