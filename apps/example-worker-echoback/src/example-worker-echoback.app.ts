import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { useWorkersLogger } from 'workers-tagged-logger'

import { getRequestLogData, logger, withNotFound, withOnError } from '@repo/hono-helpers'

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

	.onError(withOnError())
	.notFound(withNotFound())

	.all('*', async (c) => {
		const url = new URL(c.req.url)

		// we can also access env variables via
		// import { env } from 'cloudflare:workers'
		logger.info(`release: ${env.SENTRY_RELEASE}`)

		let body: string | undefined
		if (['PUT', 'POST'].includes(c.req.method) && c.req.raw.body !== null) {
			body = await c.req.text()
		}

		const headers = new Headers(c.req.raw.headers)

		const data = {
			method: c.req.method,
			url: c.req.url,
			path: url.pathname,
			host: url.host,
			hostname: url.hostname,
			headers: Object.fromEntries(headers.entries()),
			body: body ?? null,
		}

		logger
			.withTags({
				type: 'echoback_request',
				echoback_host: url.hostname,
			})
			.info(`echoback request: ${url}`, {
				data: JSON.stringify(data),
				request: getRequestLogData(c, Date.now()),
			})
		return c.json(data)
	})

export default app
