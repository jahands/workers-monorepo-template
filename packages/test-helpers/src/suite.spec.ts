import { afterAll, beforeAll, describe, expect, vi } from 'vitest'

import { testSuite } from './suite'

const { it, test } = testSuite()

describe('TestSuite', () => {
	it('has harness built into it', ({ h }) => {
		expect(h).not.toBeUndefined()
	})

	test('can also use test()', ({ h }) => {
		expect(h).not.toBeUndefined()
	})

	it('does not require using the test harness', () => {
		expect(1).toBe(1)
	})
})

describe('TestHarness', () => {
	beforeAll(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-10-05T11:21:09.308Z'))
	})
	afterAll(() => {
		vi.useRealTimers()
	})

	describe('serializers', () => {
		it('enables date serializer', ({ h }) => {
			h.serializers.enable('date_non_zero')

			expect(new Date()).toMatchInlineSnapshot(`NonZero<Date>`)
		})

		it('does use serializer on subsequent tests', () => {
			expect(new Date()).toMatchInlineSnapshot(`2025-10-05T11:21:09.308Z`)
		})

		it('prioritizes date_non_zero if both are specified', async ({ h }) => {
			h.serializers.enable('date', 'date_non_zero')
			expect(new Date()).toMatchInlineSnapshot(`NonZero<Date>`)
		})

		it('does not serialize when harness is not used', () => {
			expect(new Date()).toMatchInlineSnapshot(`2025-10-05T11:21:09.308Z`)
		})

		it('does not serialize when enable() is not called', ({ h: _h }) => {
			expect(new Date()).toMatchInlineSnapshot(`2025-10-05T11:21:09.308Z`)
		})
	})
})
