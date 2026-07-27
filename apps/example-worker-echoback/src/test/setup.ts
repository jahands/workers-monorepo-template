import { afterEach } from 'vitest'

import { resetHttpMocks } from '@repo/test-helpers/test'

// custom matchers (toBeUUID(), toBeAfterDate(), ...)
import '@repo/test-helpers/matchers'
// opt-in snapshot serializers (see @repo/test-helpers/suite)
import '@repo/test-helpers/serializer'

afterEach(() => {
	resetHttpMocks()
})
