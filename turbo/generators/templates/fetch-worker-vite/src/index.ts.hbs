import { Hono } from 'hono'
import { useWorkersLogger } from 'workers-tagged-logger'

import { getRequestLogData, logger, useNotFound, useOnError } from '@repo/hono-helpers'

import type { App } from './context'

const app = new Hono<App>()
	.use(
		'*',
		// middleware
		(c, next) =>
			useWorkersLogger(c.env.NAME, {
				environment: c.env.ENVIRONMENT,
				release: c.env.SENTRY_RELEASE,
			})(c, next)
	)

	.onError(useOnError())
	.notFound(useNotFound())

	.get('/', async (c) => {
		return c.text('hello, world!')
	})

export default app
