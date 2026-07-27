import { expect } from 'vitest'

/**
 * Global storage for test serializers.
 * The key should be unique to each test.
 */
const testSerializers = new Map<string, SnapshotSerializer>()

/**
 * Available snapshot serializers.
 *
 * @see {SnapshotSerializer.enable()} for descriptions of each serializer.
 */
export type SerializerName = 'date' | 'date_non_zero'

/**
 * Manages snapshot serializers for a test
 */
export class SnapshotSerializer {
	private readonly serializers: Set<SerializerName> = new Set()

	constructor() {
		const taskKey = getTaskKey()
		testSerializers.set(taskKey, this)
	}

	/**
	 * Enable snapshot serializers for the current test.
	 *
	 * - `date`: Enables snapshot serialization for `Date` objects.
	 * - `date_non_zero`: Enables snapshot serialization for `Date` objects that are not zero.
	 */
	enable(...serializers: SerializerName[]): void {
		for (const s of serializers) {
			this.serializers.add(s)
		}
	}

	/**
	 * Check if a serializer is enabled.
	 * @internal
	 */
	has(serializer: SerializerName): boolean {
		return this.serializers.has(serializer)
	}
}

/**
 * get unique task key for the current test
 */
function getTaskKey(): string {
	const { testPath, currentTestName } = expect.getState()

	if (!testPath || !currentTestName) {
		throw new Error('failed to get testPath or currentTestName')
	}

	return `${testPath}:${currentTestName}`
}

/**
 * check if a serializer is enabled
 */
function has(serializer: SerializerName): boolean {
	const ss = testSerializers.get(getTaskKey()) ?? new SnapshotSerializer()
	return ss.has(serializer)
}

// NOTE: last one wins, so order them accordingly

expect.addSnapshotSerializer({
	test: (val: unknown): boolean => has('date') && val instanceof Date,
	serialize: (): string => 'Any<Date>',
})

expect.addSnapshotSerializer({
	test: (val: unknown): boolean =>
		has('date_non_zero') && val instanceof Date && val.getTime() !== 0,
	serialize: (): string => 'NonZero<Date>',
})
