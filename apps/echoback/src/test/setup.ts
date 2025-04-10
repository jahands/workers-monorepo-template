import { afterEach, beforeEach } from 'vitest'

import { mockTraceExports, resetFetchMocks } from '@repo/test-helpers/test'

beforeEach(async () => {
	mockTraceExports()
})

afterEach(() => {
	resetFetchMocks()
})
