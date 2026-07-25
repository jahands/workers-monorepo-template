import { test } from 'vitest'

import { SnapshotSerializer } from './serializer'

/**
 * A test suite with some nice defaults. If additional control is needed,
 * copy this into an app and modify it as needed.
 */
export function testSuite(): TestSuite {
	return new TestSuite()
}

class TestSuite {
	get test() {
		return test.extend<{ h: TestHarness }>({
			h: async ({ task: _task }, use) => {
				const harness = new TestHarness(this)

				await use(harness)
			},
		})
	}

	get it() {
		return this.test
	}
}

class TestHarness {
	serializers = new SnapshotSerializer()

	constructor(readonly suite: TestSuite) {}
}
