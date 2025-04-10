import { Hono } from 'hono'
import PQueue from 'p-queue'

import {
	getTracingConfig,
	useAxiomLogger,
	useMeta,
	useNotFound,
	useOnError,
	useSentry,
} from '@repo/hono-helpers'
import { getRequestLogData } from '@repo/hono-helpers/src/helpers/request'

import { isHostnameRedacted, redactHeaders, redactUrl } from './redact'
import { getUrlHostname } from './url'

import type { App, Env } from './types'

const app = new Hono<App>()
	.use(
		'*', // Middleware
		useMeta,
		useSentry(initSentry, 'http.server'),
		useAxiomLogger()
	)

	// Hooks
	.onError(useOnError())
	.notFound(useNotFound())

	.all('*', async (c) => {
		const url = new URL(c.req.url)
		const shouldRedact = isHostnameRedacted(getUrlHostname(url))

		let body: string | undefined
		if (['PUT', 'POST'].includes(c.req.method) && c.req.raw.body !== null) {
			body = await c.req.text()
		}

		const headers = shouldRedact
			? redactHeaders(new Headers(c.req.raw.headers))
			: new Headers(c.req.raw.headers)

		const data = {
			method: c.req.method,
			url: shouldRedact ? redactUrl(c.req.url) : c.req.url,
			path: url.pathname,
			host: url.host,
			hostname: url.hostname,
			headers: Object.fromEntries(headers.entries()),
			body: body ?? null,
		}

		c.get('logger')?.info(`echoback request: ${url}`, {
			msc: data,
			type: 'echoback_request',
			request: getRequestLogData(c, Date.now()),
			echoback_host: url.hostname,
		})
		return c.json(data)
	})

const handler = {
	fetch: app.fetch,
	queue: async (batch: MessageBatch, _env: Env, _ctx: ExecutionContext) => {
		console.log(`got batch of ${batch.messages.length} messages`)
		// batch.messages.forEach((m) => m.ack())
	},
} satisfies ExportedHandler<Env>

export default instrument(handler, getTracingConfig<App>())
