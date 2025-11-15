import * as Sentry from '@sentry/cloudflare'

import type { DurableObject, WorkflowEntrypoint } from 'cloudflare:workers'
import type { SharedHonoEnv } from '../types'

type SentryInstrumentationOptions = {
	/**
	 * Custom sentry options
	 *
	 * Sentry will only be instrumented if SENTRY_DSN is provided in the environment.
	 *
	 * @default Handlers/DOs:
	 * ```ts
	 * {
	 *   tracesSampleRate: 0.02,
	 *   sendDefaultPii: true,
	 * }
	 * ```
	 *
	 * @default Workflows:
	 * ```ts
	 * {
	 *   tracesSampleRate: 1.0,
	 *   sendDefaultPii: true,
	 * }
	 * ```
	 */
	sentry?: Sentry.CloudflareOptions
}

export type InstrumentHandlerOptions<
	Env extends SharedHonoEnv = SharedHonoEnv,
	QueueHandlerMessage = unknown,
	CfHostMetadata = unknown,
> = SentryInstrumentationOptions & {
	/**
	 * All exported handlers (supported handlers will be instrumented)
	 */
	handler: ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>
}

/**
 * Instruments a Cloudflare Workers handler with Sentry tracing.
 *
 * This wraps your default export handler to automatically capture errors and trace requests.
 * Sentry instrumentation is only applied if SENTRY_DSN is provided in the environment.
 *
 * @param options - Configuration options including the handler and optional Sentry settings
 * @returns The instrumented handler ready to be exported
 *
 * @example
 * ```typescript
 * import { instrumentHandler } from '@repo/hono-helpers'
 *
 * const handler: ExportedHandler<Env> = {
 *   async fetch(request, env, ctx) {
 *     return new Response('Hello')
 *   }
 * }
 *
 * export default instrumentHandler({
 *   handler,
 *   sentry: { tracesSampleRate: 0.02 }
 * })
 * ```
 *
 * @disclaimer docstring by Claude Sonnet 4.5 via AmpCode
 */
export function instrumentHandler<
	Env extends SharedHonoEnv,
	QueueHandlerMessage = unknown,
	CfHostMetadata = unknown,
>(
	options: InstrumentHandlerOptions<Env, QueueHandlerMessage, CfHostMetadata>
): ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata> {
	const instrumented = Sentry.withSentry<Env, QueueHandlerMessage, CfHostMetadata>(
		(env: Env) =>
			({
				dsn: env.SENTRY_DSN,
				environment: env.ENVIRONMENT,
				release: env.SENTRY_RELEASE,
				tracesSampleRate: 0.02,
				sendDefaultPii: true,
				...options.sentry,
			}) satisfies Sentry.CloudflareOptions,
		options.handler
	)

	return instrumented
}

/**
 * Type alias for a Durable Object class constructor signature.
 *
 * We need this because we're typing the **constructor** (the class itself), not the instance.
 * When you write `instrumentDO(CounterDO, ...)`, you're passing the class/constructor,
 * not an instance. This type describes what that **constructor** must look like:
 * - Takes `(ctx: DurableObjectState, env: Env)` as parameters
 * - Returns an instance of `DurableObject<Env>`
 *
 * We explicitly define this to:
 * 1. Match Sentry's `instrumentDurableObjectWithSentry` type expectations
 * 2. Allow TypeScript to properly infer the environment type `Env` from the constructor
 * 3. Make the `instrumentDO` signature readable instead of repeating this constructor type
 *
 * @disclaimer docstring by Claude Sonnet 4.5 via AmpCode
 */
type DOClass<
	Env extends SharedHonoEnv,
	Props = unknown,
> = new (ctx: DurableObjectState<Props>, env: Env) => DurableObject<Env, Props>

export type InstrumentDOOptions = SentryInstrumentationOptions

/**
 * Instruments a Durable Object class with Sentry tracing.
 *
 * This wraps your DO class to automatically capture errors and trace requests to the DO.
 * Sentry instrumentation is only applied if SENTRY_DSN is provided in the environment.
 *
 * **Important:** Your DO class must extend `DurableObject<Env>` from `cloudflare:workers`,
 * not just implement the old `DurableObject` interface.
 *
 * @param doClass - The Durable Object class to instrument (the class itself, not an instance)
 * @param options - Optional configuration for Sentry instrumentation
 * @returns The instrumented DO class with the same type signature
 *
 * @example
 * ```typescript
 * import { DurableObject } from 'cloudflare:workers'
 * import { instrumentDO } from '@repo/hono-helpers'
 *
 * class MyDO extends DurableObject<Env> {
 *   override async fetch(request: Request) {
 *     return new Response('Hello from DO')
 *   }
 * }
 *
 * export const MyDurableObject = instrumentDO<Env>(MyDO, {
 *   sentry: { tracesSampleRate: 0.02 }
 * })
 * ```
 *
 * @disclaimer docstring by Claude Sonnet 4.5 via AmpCode
 */
export function instrumentDO<
	Env extends SharedHonoEnv,
	C extends DOClass<Env> = DOClass<Env>,
>(doClass: C, options?: InstrumentDOOptions): C {
	const instrumented = Sentry.instrumentDurableObjectWithSentry(
		(env: Env) =>
			({
				dsn: env.SENTRY_DSN,
				environment: env.ENVIRONMENT,
				release: env.SENTRY_RELEASE,
				tracesSampleRate: 0.02,
				sendDefaultPii: true,
				...options?.sentry,
			}) satisfies Sentry.CloudflareOptions,
		doClass
	)

	return instrumented
}

/**
 * Type alias for a Workflow class constructor signature.
 *
 * Similar to DOClass, this types the **constructor** (the class itself), not the instance.
 * When you write `instrumentWorkflow(MyWorkflow, ...)`, you're passing the class/constructor.
 *
 * @disclaimer docstring by Claude Sonnet 4.5 via AugmentCode
 */
type WorkflowClass<Env extends SharedHonoEnv, Params = unknown> = new (
	ctx: ExecutionContext,
	env: Env
) => WorkflowEntrypoint<Env, Params>

export type InstrumentWorkflowOptions = SentryInstrumentationOptions

/**
 * Instruments a Cloudflare Workflow class with Sentry.
 *
 * This wraps your Workflow class to automatically capture errors and trace workflow execution.
 * The workflow's instanceId is used to generate a deterministic trace_id to link all steps together.
 * Sentry instrumentation is only applied if SENTRY_DSN is provided in the environment.
 *
 * **Important:** Your Workflow class must extend `WorkflowEntrypoint<Env, Params>` from `cloudflare:workers`.
 *
 * **Note:** Create spans only inside `step.do()` callbacks. Due to workflow hibernation, code outside
 * `step.do()` may be re-executed, leading to duplicated spans.
 *
 * @param workflowClass - The Workflow class to instrument (the class itself, not an instance)
 * @param options - Optional configuration for Sentry instrumentation
 * @returns The instrumented Workflow class with the same type signature
 *
 * @example
 * ```typescript
 * import { WorkflowEntrypoint } from 'cloudflare:workers'
 * import { instrumentWorkflow } from '@repo/hono-helpers'
 *
 * class MyWorkflowBase extends WorkflowEntrypoint<Env, Params> {
 *   async run(event, step) {
 *     await step.do('fetch data', async () => {
 *       // your code here
 *     })
 *   }
 * }
 *
 * export const MyWorkflow = instrumentWorkflow<Env, Params>(MyWorkflowBase, {
 *   sentry: { tracesSampleRate: 1.0 }
 * })
 * ```
 *
 * @disclaimer docstring by Claude Sonnet 4.5 via AugmentCode
 */
export function instrumentWorkflow<
	Env extends SharedHonoEnv,
	Params = unknown,
	C extends WorkflowClass<Env, Params> = WorkflowClass<Env, Params>,
>(workflowClass: C, options?: InstrumentWorkflowOptions): C {
	const instrumented = Sentry.instrumentWorkflowWithSentry(
		(env: Env) =>
			({
				dsn: env.SENTRY_DSN,
				environment: env.ENVIRONMENT,
				release: env.SENTRY_RELEASE,
				tracesSampleRate: 1.0,
				sendDefaultPii: true,
				...options?.sentry,
			}) satisfies Sentry.CloudflareOptions,
		workflowClass
	)

	return instrumented
}
