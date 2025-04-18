import { Toucan } from 'toucan-js'

import type { Env } from '../types'

export function initSentry(
	request: Request,
	env: Pick<Env, 'SENTRY_DSN' | 'SENTRY_RELEASE' | 'ENVIRONMENT'>,
	ctx: Pick<ExecutionContext, 'waitUntil'>
): Toucan {
	return new Toucan({
		dsn: env.SENTRY_DSN,
		context: ctx,
		environment: env.ENVIRONMENT,
		release: env.SENTRY_RELEASE,
		request,
		tracesSampleRate: 0.02,
		requestDataOptions: {
			// Don't allow the `key` param to be logged
			allowedSearchParams: /^(?!(key)$).+$/,
		},
	})
}
