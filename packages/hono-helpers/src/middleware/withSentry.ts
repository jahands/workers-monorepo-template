import * as Sentry from '@sentry/cloudflare'
import { HTTPException } from 'hono/http-exception'
import { httpStatus } from 'http-codex/status'

import type { Context, Next } from 'hono'
import type { HonoApp } from '../types'

export interface WithSentryOptions {
	/**
	 * Operation name used in the top-level span
	 */
	op: string
}

/** statuses that we should never trace */
const noTraceStatuses = [
	httpStatus.Unauthorized,
	httpStatus.Forbidden,
	httpStatus.NotFound,
] as number[]

/**
 * Adds Sentry tracing to requests.
 *
 * Typically, this should be added early in the middleware chain.
 *
 * @note This middleware should be used with `instrumentHandler()` or `Sentry.withSentry()` wrapper
 * at the handler level for proper Sentry initialization. If SENTRY_DSN is not configured,
 * this middleware will pass through without adding tracing.
 */
export function withSentry<T extends HonoApp>(
	options: WithSentryOptions
): (ctx: Context<T>, next: Next) => Promise<void> {
	return async (ctx: Context<T>, next: Next): Promise<void> => {
		const c = ctx as unknown as Context<HonoApp>

		// Skip Sentry tracing if SENTRY_DSN is not configured
		if (!c.env.SENTRY_DSN) {
			await next()
			return
		}

		// Generate invocationId if not already set
		const invocationId = c.var.invocationId ?? crypto.randomUUID()
		if (!c.var.invocationId) {
			c.set('invocationId', invocationId)
		}

		await Sentry.startSpan(
			{
				op: options.op,
				name: c.req.path,
				attributes: {
					invocationId,
					'http.method': c.req.method,
					'http.url': c.req.url,
				},
			},
			async (span) => {
				c.set('txWaitUntil', [])

				Sentry.setTags({
					invocationId,
				})

				try {
					await next()
				} finally {
					span.updateName(`${c.req.method} ${c.req.routePath}`)

					let recordTrace = true
					if (c.error instanceof HTTPException && noTraceStatuses.includes(c.error.status)) {
						// Don't record transactions for auth errors or not found
						recordTrace = false
					}

					if (noTraceStatuses.includes(c.res.status)) {
						recordTrace = false
					}

					if (recordTrace) {
						const waitAndCommitTX = async (): Promise<void> => {
							await Promise.allSettled(c.get('txWaitUntil') ?? [])
							Sentry.setTags({
								should_sample: true,
							})
						}
						c.executionCtx.waitUntil(waitAndCommitTX())
					} else {
						c.executionCtx.waitUntil(Promise.allSettled(c.get('txWaitUntil') ?? []))
					}
				}
			}
		)
	}
}
