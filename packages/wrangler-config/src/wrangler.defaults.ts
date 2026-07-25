import * as z from 'zod'

import { WorkflowBinding, WranglerConfig } from './schema'

export type DefineConfigContext = typeof wranglerContext
export const wranglerContext = {
	defaults: {
		$schema: 'node_modules/wrangler/config-schema.json',
		compatibility_date: '2026-06-04',
		compatibility_flags: ['nodejs_compat'],
		workers_dev: false,
		preview_urls: false,
		dependencies_instrumentation: {
			enabled: true,
		},
		observability: {
			logs: {
				enabled: true,
				head_sampling_rate: 1,
			},
		},
		placement: {
			mode: 'smart',
		},
		vars: {
			ENVIRONMENT: 'development',
		},
		version_metadata: {
			binding: 'CF_VERSION_METADATA',
		},
	} as const satisfies Partial<WranglerConfig>,
} as const

export type WranglerConfigInput = z.infer<typeof WranglerConfigInput>
export const WranglerConfigInput = WranglerConfig.extend({
	workflows: z
		.array(
			WorkflowBinding.extend({
				binding: WorkflowBinding.shape.binding.optional().describe('defaults to value of `name`'),
				class_name: WorkflowBinding.shape.class_name
					.optional()
					.describe('defaults to value of `name`'),
			})
		)
		.optional(),
})

/**
 * WranglerConfigWithDefaults applies additional defaults at parse time
 */
export type WranglerConfigWithDefaults = z.infer<typeof WranglerConfigWithDefaults>
export const WranglerConfigWithDefaults = WranglerConfigInput.transform((input) => {
	const cfg = structuredClone(input)

	if (!cfg.name) {
		throw new Error('Invalid wrangler.config.ts: "name" must be set')
	}

	// we always want a NAME var set
	cfg.vars = {
		...cfg.vars,
		NAME: cfg.vars?.NAME ?? cfg.name,
	}

	const { workflows, ...rest } = cfg

	return WranglerConfig.decode({
		...rest,

		// It's common to use the same name/binding/class_name, so default to
		// the same name if they aren't set in the input:
		...(workflows
			? {
					workflows: workflows.map((workflow) => ({
						...workflow,
						binding: workflow.binding ?? workflow.name,
						class_name: workflow.class_name ?? workflow.name,
					})),
				}
			: {}),
	})
})
