import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { SnapshotSerializer } from './serializer'

describe('SnapshotSerializer', () => {
	beforeAll(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-10-05T11:21:09.308Z'))
	})
	afterAll(() => {
		vi.useRealTimers()
	})

	describe('enable', () => {
		it('enables date serializer', () => {
			const serializers = new SnapshotSerializer()
			serializers.enable('date_non_zero')

			expect(new Date()).toMatchInlineSnapshot(`NonZero<Date>`)
		})

		it('does use serializer on subsequent tests', () => {
			expect(new Date()).toMatchInlineSnapshot(`2025-10-05T11:21:09.308Z`)
		})

		it('prioritizes date_non_zero if both are specified', async () => {
			const serializers = new SnapshotSerializer()
			serializers.enable('date', 'date_non_zero')

			expect(new Date()).toMatchInlineSnapshot(`NonZero<Date>`)
		})

		it('does not serialize when enable() is not called', () => {
			expect(new Date()).toMatchInlineSnapshot(`2025-10-05T11:21:09.308Z`)
		})
	})
})
