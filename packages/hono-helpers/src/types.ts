import { z } from 'zod'

export type WorkersEnvironment = z.infer<typeof WorkersEnvironment>
export const WorkersEnvironment = z.enum(['VITEST', 'development', 'staging', 'production'])

/** Global bindings */
export type SharedHonoEnv = {
	/**
	 * Name of the worker used in logging/etc.
	 * Automatically pulled from package.json
	 */
	NAME: string
	/**
	 * Environment of the worker.
	 * All workers should specify env in wrangler.jsonc vars
	 */
	ENVIRONMENT: WorkersEnvironment
	/**
	 * Sentry DSN for error tracking and monitoring.
	 * Optional - Sentry will only be enabled if this is provided.
	 */
	SENTRY_DSN?: string
	/**
	 * Release version of the Worker (based on the current git commit).
	 * Useful for logs, Sentry, etc.
	 */
	SENTRY_RELEASE: string
}
/** Global Hono variables */
export type SharedHonoVariables = {
	/**
	 * Unique invocation ID for this request (used for tracing)
	 * Set automatically by withSentry middleware if not already set
	 */
	invocationId?: string
	/**
	 * Array of promises to wait for before committing Sentry transaction
	 */
	txWaitUntil?: Promise<unknown>[]
}

/** Top-level Hono app */
export interface HonoApp {
	Variables: SharedHonoVariables
	Bindings: SharedHonoEnv
}

/** Context used for non-Hono things like Durable Objects */
export type SharedAppContext = {
	var: SharedHonoVariables
	env: SharedHonoEnv
	executionCtx: Pick<ExecutionContext, 'waitUntil'>
}
