import * as Sentry from '@sentry/cloudflare'
import { HTTPException } from 'hono/http-exception'
import { httpStatus } from 'http-codex/status'

import { logger } from '../helpers/logger'

import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { APIError } from '../helpers/errors'
import type { HonoApp } from '../types'

/** Handles typical onError hooks */
export function withOnError<T extends HonoApp>() {
	return async (err: Error, ctx: Context<T>): Promise<Response> => {
		const c = ctx as unknown as Context<HonoApp>

		if (err instanceof HTTPException) {
			const status = err.getResponse().status as ContentfulStatusCode
			const body: APIError = { success: false, error: { message: err.message } }
			if (status >= 500) {
				// Capture 5xx errors to Sentry with context
				Sentry.withScope((scope) => {
					scope.setContext('HTTP Exception', {
						status: status,
						body,
					})
					Sentry.captureException(err)
				})
				logger.error(err)
			} else if (status === httpStatus.Unauthorized) {
				body.error.message = 'unauthorized'
			}

			return c.json(body, status)
		}

		// Capture all other error types to Sentry
		Sentry.captureException(err)
		logger.error(err)
		return c.json(
			{
				success: false,
				error: { message: 'internal server error' },
			} satisfies APIError,
			500
		)
	}
}
