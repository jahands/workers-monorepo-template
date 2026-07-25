import * as z from 'zod'

/**
 * Type: object
 */
type AssetsInferred = z.infer<typeof Assets>
export interface Assets extends AssetsInferred {
	/**
	 * Absolute path to assets directory
	 */
	directory?: AssetsInferred['directory']
	/**
	 * Name of `env` binding property in the User Worker.
	 */
	binding?: AssetsInferred['binding']
	/**
	 * How to handle HTML requests.
	 */
	html_handling?: AssetsInferred['html_handling']
	/**
	 * How to handle requests that do not match an asset.
	 */
	not_found_handling?: AssetsInferred['not_found_handling']
	/**
	 * Matches will be routed to the User Worker, and matches to negative rules will go to the Asset Worker.
	 *
	 * Can also be `true`, indicating that every request should be routed to the User Worker.
	 */
	run_worker_first?: AssetsInferred['run_worker_first']
}
export const Assets = z.strictObject({
	binding: z.string().optional().describe('Name of `env` binding property in the User Worker.'),
	directory: z.string().optional().describe('Absolute path to assets directory'),
	html_handling: z
		.enum(['auto-trailing-slash', 'force-trailing-slash', 'drop-trailing-slash', 'none'])
		.optional()
		.describe('How to handle HTML requests.'),
	not_found_handling: z
		.enum(['single-page-application', '404-page', 'none'])
		.optional()
		.describe('How to handle requests that do not match an asset.'),
	run_worker_first: z
		.union([z.array(z.string()), z.boolean()])
		.optional()
		.describe(
			'Matches will be routed to the User Worker, and matches to negative rules will go to the Asset Worker.\n\nCan also be `true`, indicating that every request should be routed to the User Worker.'
		),
})

/**
 * Type: object
 */
type CacheOptionsInferred = z.infer<typeof CacheOptions>
export interface CacheOptions extends CacheOptionsInferred {
	/**
	 * If cache is enabled for this Worker
	 */
	enabled: CacheOptionsInferred['enabled']
	/**
	 * Whether cached assets may be reused across Worker versions.
	 */
	cross_version_cache?: CacheOptionsInferred['cross_version_cache']
}
export const CacheOptions = z.strictObject({
	cross_version_cache: z
		.boolean()
		.optional()
		.describe('Whether cached assets may be reused across Worker versions.'),
	enabled: z.boolean().describe('If cache is enabled for this Worker'),
})

/**
 * Configuration in wrangler for Cloudchamber
 */
type CloudchamberConfigInferred = z.infer<typeof CloudchamberConfig>
export interface CloudchamberConfig extends CloudchamberConfigInferred {
	/**
	 * Type: string
	 */
	image?: CloudchamberConfigInferred['image']
	/**
	 * Type: string
	 */
	location?: CloudchamberConfigInferred['location']
	/**
	 * Allowed values: "dev", "basic", "standard", "lite", "standard-1", "standard-2", "standard-3", "standard-4"
	 */
	instance_type?: CloudchamberConfigInferred['instance_type']
	/**
	 * Type: number
	 */
	vcpu?: CloudchamberConfigInferred['vcpu']
	/**
	 * Type: string
	 */
	memory?: CloudchamberConfigInferred['memory']
	/**
	 * Type: boolean
	 */
	ipv4?: CloudchamberConfigInferred['ipv4']
}
export const CloudchamberConfig = z.strictObject({
	image: z.string().optional().describe('Type: string'),
	instance_type: z
		.enum([
			'dev',
			'basic',
			'standard',
			'lite',
			'standard-1',
			'standard-2',
			'standard-3',
			'standard-4',
		])
		.optional()
		.describe(
			'Allowed values: "dev", "basic", "standard", "lite", "standard-1", "standard-2", "standard-3", "standard-4"'
		),
	ipv4: z.boolean().optional().describe('Type: boolean'),
	location: z.string().optional().describe('Type: string'),
	memory: z.string().optional().describe('Type: string'),
	vcpu: z.number().optional().describe('Type: number'),
})

/**
 * The possible types for a `Rule`.
 */
export type ConfigModuleRuleType = z.infer<typeof ConfigModuleRuleType>
export const ConfigModuleRuleType = z.enum([
	'ESModule',
	'CommonJS',
	'CompiledWasm',
	'Text',
	'Data',
	'PythonModule',
	'PythonRequirement',
])

export type ConfiguredExport = z.infer<typeof ConfiguredExport>
export const ConfiguredExport = z.union([
	z.lazy(() => DurableObjectExport),
	z.lazy(() => WorkerEntrypointExport),
])

/**
 * Configuration for a container application
 */
type ContainerAppInferred = z.infer<typeof ContainerApp>
export interface ContainerApp extends ContainerAppInferred {
	/**
	 * Name of the application
	 */
	name?: ContainerAppInferred['name']
	/**
	 * Number of maximum application instances.
	 */
	max_instances?: ContainerAppInferred['max_instances']
	/**
	 * The path to a Dockerfile, or an image URI for the Cloudflare registry.
	 */
	image: ContainerAppInferred['image']
	/**
	 * Build context of the application.
	 */
	image_build_context?: ContainerAppInferred['image_build_context']
	/**
	 * Image variables available to the image at build-time only. For runtime env vars, refer to https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/
	 */
	image_vars?: ContainerAppInferred['image_vars']
	/**
	 * The class name of the Durable Object the container is connected to.
	 */
	class_name: ContainerAppInferred['class_name']
	/**
	 * The scheduling policy of the application
	 *
	 * @default "default"
	 */
	scheduling_policy?: ContainerAppInferred['scheduling_policy']
	/**
	 * The instance type to be used for the container. Select from one of the following named instance types:  - lite: 1/16 vCPU, 256 MiB memory, and 2 GB disk  - basic: 1/4 vCPU, 1 GiB memory, and 4 GB disk  - standard-1: 1/2 vCPU, 4 GiB memory, and 8 GB disk  - standard-2: 1 vCPU, 6 GiB memory, and 12 GB disk  - standard-3: 2 vCPU, 8 GiB memory, and 16 GB disk  - standard-4: 4 vCPU, 12 GiB memory, and 20 GB disk  - dev: 1/16 vCPU, 256 MiB memory, and 2 GB disk (deprecated, use "lite" instead)  - standard: 1 vCPU, 4 GiB memory, and 4 GB disk (deprecated, use "standard-1" instead)
	 *
	 * Customers on an enterprise plan have the additional option to set custom limits.
	 *
	 * @default "dev"
	 */
	instance_type?: ContainerAppInferred['instance_type']
	/**
	 * Type: object
	 */
	ssh?: ContainerAppInferred['ssh']
	/**
	 * SSH public keys to put in the container's authorized_keys file.
	 */
	authorized_keys?: ContainerAppInferred['authorized_keys']
	/**
	 * Trusted user CA keys to put in the container's trusted_user_ca_keys file.
	 */
	trusted_user_ca_keys?: ContainerAppInferred['trusted_user_ca_keys']
	/**
	 * Scheduling constraints for container placement.
	 */
	constraints?: ContainerAppInferred['constraints']
	/**
	 * Configures what percentage of instances should be updated at each step of a rollout. You can specify this as a single number, or an array of numbers.
	 *
	 * If this is a single number, each step will progress by that percentage. The options are 5, 10, 20, 25, 50 or 100.
	 *
	 * If this is an array, each step specifies the cumulative rollout progress. The final step must be 100.
	 *
	 * This can be overridden adhoc by deploying with the `--containers-rollout=immediate` flag, which will roll out to 100% of instances in one step.
	 *
	 * @default [10,100]
	 */
	rollout_step_percentage?: ContainerAppInferred['rollout_step_percentage']
	/**
	 * Configures the grace period (in seconds) for active instances before being shutdown during a rollout.
	 *
	 * @default 0
	 */
	rollout_active_grace_period?: ContainerAppInferred['rollout_active_grace_period']
}
export const ContainerApp = z.strictObject({
	authorized_keys: z
		.array(
			z.strictObject({
				name: z.string().describe('Type: string'),
				public_key: z.string().describe('Type: string'),
			})
		)
		.optional()
		.describe("SSH public keys to put in the container's authorized_keys file."),
	class_name: z
		.string()
		.describe('The class name of the Durable Object the container is connected to.'),
	constraints: z
		.strictObject({
			jurisdiction: z
				.enum(['eu', 'fedramp'])
				.optional()
				.describe('Restrict containers to compliance boundaries.'),
			regions: z
				.array(z.enum(['ENAM', 'WNAM', 'EEUR', 'WEUR', 'APAC', 'SAM', 'ME', 'OC', 'AFR']))
				.optional()
				.describe('Limit container placement to specific geographic regions.'),
		})
		.optional()
		.describe('Scheduling constraints for container placement.'),
	image: z
		.string()
		.describe('The path to a Dockerfile, or an image URI for the Cloudflare registry.'),
	image_build_context: z.string().optional().describe('Build context of the application.'),
	image_vars: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'Image variables available to the image at build-time only. For runtime env vars, refer to https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/'
		),
	instance_type: z
		.union([
			z.literal('dev'),
			z.literal('basic'),
			z.literal('standard'),
			z.literal('lite'),
			z.literal('standard-1'),
			z.literal('standard-2'),
			z.literal('standard-3'),
			z.literal('standard-4'),
			z.strictObject({
				disk_mb: z.number().optional().describe('Type: number'),
				memory_mib: z.number().optional().describe('Type: number'),
				vcpu: z.number().optional().describe('Type: number'),
			}),
		])
		.optional()
		.describe(
			'The instance type to be used for the container. Select from one of the following named instance types:  - lite: 1/16 vCPU, 256 MiB memory, and 2 GB disk  - basic: 1/4 vCPU, 1 GiB memory, and 4 GB disk  - standard-1: 1/2 vCPU, 4 GiB memory, and 8 GB disk  - standard-2: 1 vCPU, 6 GiB memory, and 12 GB disk  - standard-3: 2 vCPU, 8 GiB memory, and 16 GB disk  - standard-4: 4 vCPU, 12 GiB memory, and 20 GB disk  - dev: 1/16 vCPU, 256 MiB memory, and 2 GB disk (deprecated, use "lite" instead)  - standard: 1 vCPU, 4 GiB memory, and 4 GB disk (deprecated, use "standard-1" instead)\n\nCustomers on an enterprise plan have the additional option to set custom limits.\n\nDefault: "dev"'
		),
	max_instances: z.number().optional().describe('Number of maximum application instances.'),
	name: z.string().optional().describe('Name of the application'),
	rollout_active_grace_period: z
		.number()
		.optional()
		.describe(
			'Configures the grace period (in seconds) for active instances before being shutdown during a rollout.\n\nDefault: 0'
		),
	rollout_step_percentage: z
		.union([z.number(), z.array(z.number())])
		.optional()
		.describe(
			'Configures what percentage of instances should be updated at each step of a rollout. You can specify this as a single number, or an array of numbers.\n\nIf this is a single number, each step will progress by that percentage. The options are 5, 10, 20, 25, 50 or 100.\n\nIf this is an array, each step specifies the cumulative rollout progress. The final step must be 100.\n\nThis can be overridden adhoc by deploying with the `--containers-rollout=immediate` flag, which will roll out to 100% of instances in one step.\n\nDefault: [10,100]'
		),
	scheduling_policy: z
		.enum(['default', 'moon', 'regional'])
		.optional()
		.describe('The scheduling policy of the application\n\nDefault: "default"'),
	ssh: z
		.strictObject({
			enabled: z
				.boolean()
				.describe(
					'If enabled, those with write access to a container will be able to SSH into it through Wrangler.\n\nDefault: false'
				),
			port: z.number().optional().describe('Port that the SSH service is running on'),
		})
		.optional()
		.describe('Type: object'),
	trusted_user_ca_keys: z
		.array(
			z.strictObject({
				name: z.string().optional().describe('Type: string'),
				public_key: z.string().describe('Type: string'),
			})
		)
		.optional()
		.describe("Trusted user CA keys to put in the container's trusted_user_ca_keys file."),
})

export type ContainerEngine = z.infer<typeof ContainerEngine>
export const ContainerEngine = z.union([
	z.strictObject({
		localDocker: z.lazy(() => DockerConfiguration),
	}),
	z.string(),
])

/**
 * Type: object
 */
type CustomDomainRouteInferred = z.infer<typeof CustomDomainRoute>
export interface CustomDomainRoute extends CustomDomainRouteInferred {
	/**
	 * Type: string
	 */
	pattern: CustomDomainRouteInferred['pattern']
	/**
	 * Type: boolean
	 */
	custom_domain: CustomDomainRouteInferred['custom_domain']
	/**
	 * Type: boolean
	 */
	enabled?: CustomDomainRouteInferred['enabled']
	/**
	 * Type: boolean
	 */
	previews_enabled?: CustomDomainRouteInferred['previews_enabled']
}
export const CustomDomainRoute = z.strictObject({
	custom_domain: z.boolean().describe('Type: boolean'),
	enabled: z.boolean().optional().describe('Type: boolean'),
	pattern: z.string().describe('Type: string'),
	previews_enabled: z.boolean().optional().describe('Type: boolean'),
})

/**
 * Type: object
 */
type DispatchNamespaceOutboundInferred = z.infer<typeof DispatchNamespaceOutbound>
export interface DispatchNamespaceOutbound extends DispatchNamespaceOutboundInferred {
	/**
	 * Name of the service handling the outbound requests
	 */
	service: DispatchNamespaceOutboundInferred['service']
	/**
	 * (Optional) Name of the environment handling the outbound requests.
	 */
	environment?: DispatchNamespaceOutboundInferred['environment']
	/**
	 * (Optional) List of parameter names, for sending context from your dispatch Worker to the outbound handler
	 */
	parameters?: DispatchNamespaceOutboundInferred['parameters']
}
export const DispatchNamespaceOutbound = z.strictObject({
	environment: z
		.string()
		.optional()
		.describe('(Optional) Name of the environment handling the outbound requests.'),
	parameters: z
		.array(z.string())
		.optional()
		.describe(
			'(Optional) List of parameter names, for sending context from your dispatch Worker to the outbound handler'
		),
	service: z.string().describe('Name of the service handling the outbound requests'),
})

/**
 * Type: object
 */
type DockerConfigurationInferred = z.infer<typeof DockerConfiguration>
export interface DockerConfiguration extends DockerConfigurationInferred {
	/**
	 * Socket used by miniflare to communicate with Docker
	 */
	socketPath: DockerConfigurationInferred['socketPath']
	/**
	 * Docker image name for the container egress interceptor sidecar
	 */
	containerEgressInterceptorImage?: DockerConfigurationInferred['containerEgressInterceptorImage']
}
export const DockerConfiguration = z.strictObject({
	containerEgressInterceptorImage: z
		.string()
		.optional()
		.describe('Docker image name for the container egress interceptor sidecar'),
	socketPath: z.string().describe('Socket used by miniflare to communicate with Docker'),
})

/**
 * Type: array
 */
export type DurableObjectBindings = z.infer<typeof DurableObjectBindings>
export const DurableObjectBindings = z.array(
	z.strictObject({
		class_name: z.string().describe('The exported class name of the Durable Object'),
		environment: z
			.string()
			.optional()
			.describe('The service environment of the script_name to bind to'),
		name: z.string().describe('The name of the binding used to refer to the Durable Object'),
		script_name: z
			.string()
			.optional()
			.describe("The script where the Durable Object is defined (if it's external to this Worker)"),
	})
)

/**
 * A single declarative Durable Object export entry in the `exports` config map. `type` is reserved for the export kind. `state` carries the Durable Object lifecycle and defaults to `"created"` (live) when omitted.
 *
 * Mutually exclusive with  {@link  DurableObjectMigration }  at the config- validation boundary.
 *
 *  - `created` (default, live): `storage` is required.  - `deleted` (tombstone): retire a provisioned namespace whose class has    been removed from code.  - `renamed` (tombstone): rewrite a provisioned namespace's class name to    `renamed_to`. The target name must also appear as a live (state    `"created"`) `durable-object` entry in the same map.  - `transferred` (tombstone): hand ownership of the namespace to another    script in the same account (`transferred_to`). Two-phase commit;    the target must first deploy an `expecting-transfer` entry naming this    script via `transfer_from`.  - `expecting-transfer` (live): receiving side of a two-phase transfer;    `storage` and `transfer_from` are both required.
 */
export type DurableObjectExport = z.infer<typeof DurableObjectExport>
export const DurableObjectExport = z.union([
	z.strictObject({
		state: z.literal('created').optional().describe('Allowed value: "created"'),
		storage: z.lazy(() => DurableObjectExportStorage),
		type: z.literal('durable-object').describe('Allowed value: "durable-object"'),
	}),
	z.strictObject({
		state: z.literal('deleted').describe('Allowed value: "deleted"'),
		type: z.literal('durable-object').describe('Allowed value: "durable-object"'),
	}),
	z.strictObject({
		renamed_to: z.string().describe('Type: string'),
		state: z.literal('renamed').describe('Allowed value: "renamed"'),
		type: z.literal('durable-object').describe('Allowed value: "durable-object"'),
	}),
	z.strictObject({
		state: z.literal('transferred').describe('Allowed value: "transferred"'),
		transferred_to: z.string().describe('Type: string'),
		type: z.literal('durable-object').describe('Allowed value: "durable-object"'),
	}),
	z.strictObject({
		state: z.literal('expecting-transfer').describe('Allowed value: "expecting-transfer"'),
		storage: z.lazy(() => DurableObjectExportStorage),
		transfer_from: z.string().describe('Type: string'),
		type: z.literal('durable-object').describe('Allowed value: "durable-object"'),
	}),
])

/**
 * Storage backend for a declarative Durable Object export. See  {@link  DurableObjectExport } .
 */
export type DurableObjectExportStorage = z.infer<typeof DurableObjectExportStorage>
export const DurableObjectExportStorage = z.enum(['sqlite', 'legacy-kv'])

/**
 * Configuration in wrangler for Durable Object Migrations
 */
type DurableObjectMigrationInferred = z.infer<typeof DurableObjectMigration>
export interface DurableObjectMigration extends DurableObjectMigrationInferred {
	/**
	 * A unique identifier for this migration.
	 */
	tag: DurableObjectMigrationInferred['tag']
	/**
	 * The new Durable Objects being defined.
	 */
	new_classes?: DurableObjectMigrationInferred['new_classes']
	/**
	 * The new SQLite Durable Objects being defined.
	 */
	new_sqlite_classes?: DurableObjectMigrationInferred['new_sqlite_classes']
	/**
	 * The Durable Objects being renamed.
	 */
	renamed_classes?: DurableObjectMigrationInferred['renamed_classes']
	/**
	 * The Durable Objects being removed.
	 */
	deleted_classes?: DurableObjectMigrationInferred['deleted_classes']
}
export const DurableObjectMigration = z.strictObject({
	deleted_classes: z.array(z.string()).optional().describe('The Durable Objects being removed.'),
	new_classes: z.array(z.string()).optional().describe('The new Durable Objects being defined.'),
	new_sqlite_classes: z
		.array(z.string())
		.optional()
		.describe('The new SQLite Durable Objects being defined.'),
	renamed_classes: z
		.array(
			z.strictObject({
				from: z.string().describe('Type: string'),
				to: z.string().describe('Type: string'),
			})
		)
		.optional()
		.describe('The Durable Objects being renamed.'),
	tag: z.string().describe('A unique identifier for this migration.'),
})

/**
 * The declarative `exports` map keyed by export name. Durable Object exports are mutually exclusive with `migrations` at the wrangler config layer.
 */
export type Exports = z.infer<typeof Exports>
export const Exports = z.looseObject({}).catchall(z.lazy(() => ConfiguredExport))

/**
 * The `EnvironmentInheritable` interface declares all the configuration fields for an environment that can be inherited (and overridden) from the top-level environment.
 */
type Interface76904064710589207117690406470526752004818536Inferred = z.infer<
	typeof Interface76904064710589207117690406470526752004818536
>
export interface Interface76904064710589207117690406470526752004818536 extends Interface76904064710589207117690406470526752004818536Inferred {
	/**
	 * The name of your Worker. Alphanumeric + dashes only.
	 */
	name?: Interface76904064710589207117690406470526752004818536Inferred['name']
	/**
	 * This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.
	 */
	account_id?: Interface76904064710589207117690406470526752004818536Inferred['account_id']
	/**
	 * A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-dates
	 */
	compatibility_date?: Interface76904064710589207117690406470526752004818536Inferred['compatibility_date']
	/**
	 * A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/
	 *
	 * @default []
	 */
	compatibility_flags: Interface76904064710589207117690406470526752004818536Inferred['compatibility_flags']
	/**
	 * The entrypoint/path to the JavaScript file that will be executed.
	 */
	main?: Interface76904064710589207117690406470526752004818536Inferred['main']
	/**
	 * If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.
	 */
	find_additional_modules?: Interface76904064710589207117690406470526752004818536Inferred['find_additional_modules']
	/**
	 * Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.
	 */
	preserve_file_names?: Interface76904064710589207117690406470526752004818536Inferred['preserve_file_names']
	/**
	 * The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.
	 */
	base_dir?: Interface76904064710589207117690406470526752004818536Inferred['base_dir']
	/**
	 * Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
	 *
	 * @default true
	 */
	workers_dev?: Interface76904064710589207117690406470526752004818536Inferred['workers_dev']
	/**
	 * Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.
	 *
	 * @default false
	 */
	preview_urls?: Interface76904064710589207117690406470526752004818536Inferred['preview_urls']
	/**
	 * A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker (see `triggers`)
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes
	 */
	routes?: Interface76904064710589207117690406470526752004818536Inferred['routes']
	/**
	 * A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker
	 */
	route?: Interface76904064710589207117690406470526752004818536Inferred['route']
	/**
	 * Path to a custom tsconfig
	 */
	tsconfig?: Interface76904064710589207117690406470526752004818536Inferred['tsconfig']
	/**
	 * The function to use to replace jsx syntax.
	 *
	 * @default "React.createElement"
	 */
	jsx_factory: Interface76904064710589207117690406470526752004818536Inferred['jsx_factory']
	/**
	 * The function to use to replace jsx fragment syntax.
	 *
	 * @default "React.Fragment"
	 */
	jsx_fragment: Interface76904064710589207117690406470526752004818536Inferred['jsx_fragment']
	/**
	 * A list of migrations that should be uploaded with your Worker.
	 *
	 * These define changes in your Durable Object declarations.
	 *
	 * More details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations
	 *
	 * @default []
	 */
	migrations: Interface76904064710589207117690406470526752004818536Inferred['migrations']
	/**
	 * Declarative exports configuration — a map of class name to export configuration.
	 *
	 * The configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.
	 *
	 * @default {}
	 */
	exports: Interface76904064710589207117690406470526752004818536Inferred['exports']
	/**
	 * "Cron" definitions to trigger a Worker's "scheduled" function.
	 *
	 * Lets you call Workers periodically, much like a cron job.
	 *
	 * More details here https://developers.cloudflare.com/workers/platform/cron-triggers
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers
	 *
	 * @default {"crons":[]}
	 */
	triggers: Interface76904064710589207117690406470526752004818536Inferred['triggers']
	/**
	 * Specify limits for runtime behavior. Only supported for the "standard" Usage Model
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits
	 */
	limits?: Interface76904064710589207117690406470526752004818536Inferred['limits']
	/**
	 * An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling
	 */
	rules: Interface76904064710589207117690406470526752004818536Inferred['rules']
	/**
	 * Configures a custom build step to be run by Wrangler when building your Worker.
	 *
	 * Refer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds
	 *
	 * @default {"watch_dir":"./src"}
	 */
	build: Interface76904064710589207117690406470526752004818536Inferred['build']
	/**
	 * Skip internal build steps and directly deploy script
	 */
	no_bundle?: Interface76904064710589207117690406470526752004818536Inferred['no_bundle']
	/**
	 * Minify the script before uploading.
	 */
	minify?: Interface76904064710589207117690406470526752004818536Inferred['minify']
	/**
	 * Set the `name` property to the original name for functions and classes renamed during minification.
	 *
	 * See https://esbuild.github.io/api/#keep-names
	 *
	 * @default true
	 */
	keep_names?: Interface76904064710589207117690406470526752004818536Inferred['keep_names']
	/**
	 * Designates this Worker as an internal-only "first-party" Worker.
	 */
	first_party_worker?: Interface76904064710589207117690406470526752004818536Inferred['first_party_worker']
	/**
	 * List of bindings that you will send to logfwdr
	 *
	 * @default {"bindings":[]}
	 */
	logfwdr: Interface76904064710589207117690406470526752004818536Inferred['logfwdr']
	/**
	 * Send Trace Events from this Worker to Workers Logpush.
	 *
	 * This will not configure a corresponding Logpush job automatically.
	 *
	 * For more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/
	 */
	logpush?: Interface76904064710589207117690406470526752004818536Inferred['logpush']
	/**
	 * Include source maps when uploading this worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps
	 */
	upload_source_maps?: Interface76904064710589207117690406470526752004818536Inferred['upload_source_maps']
	/**
	 * Specify how the Worker should be located to minimize round-trip time.
	 *
	 * More details: https://developers.cloudflare.com/workers/platform/smart-placement/
	 */
	placement?: Interface76904064710589207117690406470526752004818536Inferred['placement']
	/**
	 * Specify the directory of static assets to deploy/serve
	 *
	 * More details at https://developers.cloudflare.com/workers/frameworks/
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets
	 */
	assets?: Interface76904064710589207117690406470526752004818536Inferred['assets']
	/**
	 * Specify the observability behavior of the Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability
	 */
	observability?: Interface76904064710589207117690406470526752004818536Inferred['observability']
	/**
	 * Specify the cache behavior of the Worker.
	 */
	cache?: Interface76904064710589207117690406470526752004818536Inferred['cache']
	/**
	 * Specify the compliance region mode of the Worker.
	 *
	 * Although if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.
	 */
	compliance_region?: Interface76904064710589207117690406470526752004818536Inferred['compliance_region']
	/**
	 * Configuration for Python modules.
	 */
	python_modules: Interface76904064710589207117690406470526752004818536Inferred['python_modules']
	/**
	 * Configuration for Worker Previews.
	 *
	 * Previews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews
	 */
	previews?: Interface76904064710589207117690406470526752004818536Inferred['previews']
}
export const Interface76904064710589207117690406470526752004818536 = z.strictObject({
	account_id: z
		.string()
		.optional()
		.describe(
			'This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.'
		),
	assets: z
		.lazy(() => Assets)
		.optional()
		.describe(
			'Specify the directory of static assets to deploy/serve\n\nMore details at https://developers.cloudflare.com/workers/frameworks/\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets'
		),
	base_dir: z
		.string()
		.optional()
		.describe(
			'The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.'
		),
	build: z
		.strictObject({
			command: z
				.string()
				.optional()
				.describe(
					'The command used to build your Worker. On Linux and macOS, the command is executed in the `sh` shell and the `cmd` shell for Windows. The `&&` and `||` shell operators may be used.'
				),
			cwd: z.string().optional().describe('The directory in which the command is executed.'),
			watch_dir: z
				.union([z.string(), z.array(z.string())])
				.optional()
				.describe(
					'The directory to watch for changes while using wrangler dev, defaults to the current working directory'
				),
		})
		.describe(
			'Configures a custom build step to be run by Wrangler when building your Worker.\n\nRefer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds\n\nDefault: {"watch_dir":"./src"}'
		),
	cache: z
		.lazy(() => CacheOptions)
		.optional()
		.describe('Specify the cache behavior of the Worker.'),
	compatibility_date: z
		.string()
		.optional()
		.describe(
			'A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-dates'
		),
	compatibility_flags: z
		.array(z.string())
		.describe(
			'A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/\n\nDefault: []'
		),
	compliance_region: z
		.enum(['public', 'fedramp_high'])
		.optional()
		.describe(
			'Specify the compliance region mode of the Worker.\n\nAlthough if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.'
		),
	exports: z
		.lazy(() => Exports)
		.describe(
			'Declarative exports configuration — a map of class name to export configuration.\n\nThe configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.\n\nDefault: {}'
		),
	find_additional_modules: z
		.boolean()
		.optional()
		.describe(
			'If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.'
		),
	first_party_worker: z
		.boolean()
		.optional()
		.describe('Designates this Worker as an internal-only "first-party" Worker.'),
	jsx_factory: z
		.string()
		.describe('The function to use to replace jsx syntax.\n\nDefault: "React.createElement"'),
	jsx_fragment: z
		.string()
		.describe('The function to use to replace jsx fragment syntax.\n\nDefault: "React.Fragment"'),
	keep_names: z
		.boolean()
		.optional()
		.describe(
			'Set the `name` property to the original name for functions and classes renamed during minification.\n\nSee https://esbuild.github.io/api/#keep-names\n\nDefault: true'
		),
	limits: z
		.lazy(() => UserLimits)
		.optional()
		.describe(
			'Specify limits for runtime behavior. Only supported for the "standard" Usage Model\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits'
		),
	logfwdr: z
		.strictObject({
			bindings: z
				.array(
					z.strictObject({
						destination: z.string().describe('The destination for this logged message'),
						name: z.string().describe('The binding name used to refer to logfwdr'),
					})
				)
				.describe('Type: array'),
		})
		.describe('List of bindings that you will send to logfwdr\n\nDefault: {"bindings":[]}'),
	logpush: z
		.boolean()
		.optional()
		.describe(
			'Send Trace Events from this Worker to Workers Logpush.\n\nThis will not configure a corresponding Logpush job automatically.\n\nFor more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/'
		),
	main: z
		.string()
		.optional()
		.describe('The entrypoint/path to the JavaScript file that will be executed.'),
	migrations: z
		.array(z.lazy(() => DurableObjectMigration))
		.describe(
			'A list of migrations that should be uploaded with your Worker.\n\nThese define changes in your Durable Object declarations.\n\nMore details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations\n\nDefault: []'
		),
	minify: z.boolean().optional().describe('Minify the script before uploading.'),
	name: z.string().optional().describe('The name of your Worker. Alphanumeric + dashes only.'),
	no_bundle: z
		.boolean()
		.optional()
		.describe('Skip internal build steps and directly deploy script'),
	observability: z
		.lazy(() => Observability)
		.optional()
		.describe(
			'Specify the observability behavior of the Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability'
		),
	placement: z
		.union([
			z.strictObject({
				hint: z.string().optional().describe('Type: string'),
				mode: z.enum(['off', 'smart']).describe('Allowed values: "off", "smart"'),
			}),
			z.strictObject({
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
				region: z.string().describe('Type: string'),
			}),
			z.strictObject({
				host: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
			z.strictObject({
				hostname: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
		])
		.optional()
		.describe(
			'Specify how the Worker should be located to minimize round-trip time.\n\nMore details: https://developers.cloudflare.com/workers/platform/smart-placement/'
		),
	preserve_file_names: z
		.boolean()
		.optional()
		.describe(
			'Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.'
		),
	preview_urls: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.\n\nDefault: false'
		),
	get previews() {
		return PreviewsConfig.optional().describe(
			"Configuration for Worker Previews.\n\nPreviews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews"
		)
	},
	python_modules: z
		.strictObject({
			exclude: z
				.array(z.string())
				.describe(
					'A list of glob patterns to exclude files from the python_modules directory when bundling.\n\nPatterns are relative to the python_modules directory and use glob syntax.\n\nDefault: ["***.pyc"]'
				),
		})
		.describe('Configuration for Python modules.'),
	route: z
		.lazy(() => Route)
		.optional()
		.describe(
			"A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker"
		),
	routes: z
		.array(z.lazy(() => Route))
		.optional()
		.describe(
			"A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker (see `triggers`)\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes"
		),
	rules: z
		.array(z.lazy(() => Rule))
		.describe(
			'An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling'
		),
	triggers: z
		.strictObject({
			crons: z.array(z.string()).optional().describe('Type: array'),
		})
		.describe(
			'"Cron" definitions to trigger a Worker\'s "scheduled" function.\n\nLets you call Workers periodically, much like a cron job.\n\nMore details here https://developers.cloudflare.com/workers/platform/cron-triggers\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers\n\nDefault: {"crons":[]}'
		),
	tsconfig: z.string().optional().describe('Path to a custom tsconfig'),
	upload_source_maps: z
		.boolean()
		.optional()
		.describe(
			'Include source maps when uploading this worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps'
		),
	workers_dev: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev\n\nDefault: true'
		),
})

export interface JsonObject {
	[key: string]: Json
}
export type Json = string | number | boolean | null | Json[] | JsonObject
export const Json: z.ZodType<Json> = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.lazy(() => Json)),
	z.looseObject({}).catchall(z.lazy(() => Json)),
])

/**
 * Type: object
 */
type ObservabilityInferred = z.infer<typeof Observability>
export interface Observability extends ObservabilityInferred {
	/**
	 * If observability is enabled for this Worker
	 */
	enabled?: ObservabilityInferred['enabled']
	/**
	 * The sampling rate
	 */
	head_sampling_rate?: ObservabilityInferred['head_sampling_rate']
	/**
	 * Type: object
	 */
	logs?: ObservabilityInferred['logs']
	/**
	 * Type: object
	 */
	traces?: ObservabilityInferred['traces']
}
export const Observability = z.strictObject({
	enabled: z.boolean().optional().describe('If observability is enabled for this Worker'),
	head_sampling_rate: z.number().optional().describe('The sampling rate'),
	logs: z
		.strictObject({
			destinations: z
				.array(z.string())
				.optional()
				.describe(
					'What destinations logs emitted from the Worker should be sent to.\n\nDefault: []'
				),
			enabled: z.boolean().optional().describe('Type: boolean'),
			head_sampling_rate: z.number().optional().describe('The sampling rate'),
			invocation_logs: z.boolean().optional().describe('Set to false to disable invocation logs'),
			persist: z
				.boolean()
				.optional()
				.describe(
					'If logs should be persisted to the Cloudflare observability platform where they can be queried in the dashboard.\n\nDefault: true'
				),
		})
		.optional()
		.describe('Type: object'),
	traces: z
		.strictObject({
			destinations: z
				.array(z.string())
				.optional()
				.describe(
					'What destinations traces emitted from the Worker should be sent to.\n\nDefault: []'
				),
			enabled: z.boolean().optional().describe('Type: boolean'),
			head_sampling_rate: z.number().optional().describe('The sampling rate'),
			persist: z
				.boolean()
				.optional()
				.describe(
					'If traces should be persisted to the Cloudflare observability platform where they can be queried in the dashboard.\n\nDefault: true'
				),
		})
		.optional()
		.describe('Type: object'),
})

/**
 * Configuration for Worker Previews.
 *
 * This defines the settings used when creating Preview deployments. Previews are branches of your Worker's main instance used to test features during feature development outside of production.
 *
 * The `previews` block contains any intentionally divergent configuration intended solely for Previews, including:
 * - All non-inheritable properties (environment variables and bindings like KV, D1, R2, etc.)
 * - Select inheritable properties: `logpush`, `observability`, `limits`, `cache`
 */
type PreviewsConfigInferred = z.infer<typeof PreviewsConfig>
export interface PreviewsConfig extends PreviewsConfigInferred {
	logpush?: PreviewsConfigInferred['logpush']
	observability?: PreviewsConfigInferred['observability']
	limits?: PreviewsConfigInferred['limits']
	cache?: PreviewsConfigInferred['cache']
	/**
	 * A map of values to substitute when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	define?: PreviewsConfigInferred['define']
	/**
	 * A map of environment variables to set when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
	 *
	 * @default {}
	 */
	vars?: PreviewsConfigInferred['vars']
	/**
	 * Secrets configuration.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property
	 */
	secrets?: PreviewsConfigInferred['secrets']
	/**
	 * A list of durable objects that your Worker should be bound to.
	 *
	 * For more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects
	 *
	 * @default {"bindings":[]}
	 */
	durable_objects?: PreviewsConfigInferred['durable_objects']
	/**
	 * A list of workflows that your Worker should be bound to.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	workflows?: PreviewsConfigInferred['workflows']
	/**
	 * Cloudchamber configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	cloudchamber?: PreviewsConfigInferred['cloudchamber']
	/**
	 * Container related configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	containers?: PreviewsConfigInferred['containers']
	/**
	 * These specify any Workers KV Namespaces you want to access from inside your Worker.
	 *
	 * To learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces
	 *
	 * @default []
	 */
	kv_namespaces?: PreviewsConfigInferred['kv_namespaces']
	/**
	 * These specify bindings to send email from inside your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings
	 *
	 * @default []
	 */
	send_email?: PreviewsConfigInferred['send_email']
	/**
	 * Specifies Queues that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues
	 *
	 * @default {"consumers":[],"producers":[]}
	 */
	queues?: PreviewsConfigInferred['queues']
	/**
	 * Specifies R2 buckets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets
	 *
	 * @default []
	 */
	r2_buckets?: PreviewsConfigInferred['r2_buckets']
	/**
	 * Specifies D1 databases that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases
	 *
	 * @default []
	 */
	d1_databases?: PreviewsConfigInferred['d1_databases']
	/**
	 * Specifies Vectorize indexes that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes
	 *
	 * @default []
	 */
	vectorize?: PreviewsConfigInferred['vectorize']
	/**
	 * Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search_namespaces?: PreviewsConfigInferred['ai_search_namespaces']
	/**
	 * Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search?: PreviewsConfigInferred['ai_search']
	/**
	 * Specifies Agent Memory namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	agent_memory?: PreviewsConfigInferred['agent_memory']
	/**
	 * Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	websearch?: PreviewsConfigInferred['websearch']
	/**
	 * Specifies Hyperdrive configs that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive
	 *
	 * @default []
	 */
	hyperdrive?: PreviewsConfigInferred['hyperdrive']
	/**
	 * Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings
	 *
	 * @default []
	 */
	services?: PreviewsConfigInferred['services']
	/**
	 * Specifies analytics engine datasets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets
	 *
	 * @default []
	 */
	analytics_engine_datasets?: PreviewsConfigInferred['analytics_engine_datasets']
	/**
	 * A browser that will be usable from the Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering
	 */
	browser?: PreviewsConfigInferred['browser']
	/**
	 * Binding to the AI project.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai
	 */
	ai?: PreviewsConfigInferred['ai']
	/**
	 * Binding to Cloudflare Images
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images
	 */
	images?: PreviewsConfigInferred['images']
	/**
	 * Binding to Cloudflare Media Transformations
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	media?: PreviewsConfigInferred['media']
	/**
	 * Binding to Cloudflare Stream
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	stream?: PreviewsConfigInferred['stream']
	/**
	 * Binding to the Worker Version's metadata
	 */
	version_metadata?: PreviewsConfigInferred['version_metadata']
	/**
	 * "Unsafe" tables for features that aren't directly supported by wrangler.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	unsafe?: PreviewsConfigInferred['unsafe']
	/**
	 * Specifies a list of mTLS certificates that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates
	 *
	 * @default []
	 */
	mtls_certificates?: PreviewsConfigInferred['mtls_certificates']
	/**
	 * Specifies a list of Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	tail_consumers?: PreviewsConfigInferred['tail_consumers']
	/**
	 * Specifies a list of Streaming Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	streaming_tail_consumers?: PreviewsConfigInferred['streaming_tail_consumers']
	/**
	 * Specifies namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms
	 *
	 * @default []
	 */
	dispatch_namespaces?: PreviewsConfigInferred['dispatch_namespaces']
	/**
	 * Specifies list of Pipelines bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	pipelines?: PreviewsConfigInferred['pipelines']
	/**
	 * Specifies Secret Store bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	secrets_store_secrets?: PreviewsConfigInferred['secrets_store_secrets']
	/**
	 * Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	artifacts?: PreviewsConfigInferred['artifacts']
	/**
	 * **DO NOT USE**. Hello World Binding Config to serve as an explanatory example.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	unsafe_hello_world?: PreviewsConfigInferred['unsafe_hello_world']
	/**
	 * Specifies Flagship feature flag bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	flagship?: PreviewsConfigInferred['flagship']
	/**
	 * Specifies rate limit bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ratelimits?: PreviewsConfigInferred['ratelimits']
	/**
	 * Specifies Worker Loader bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	worker_loaders?: PreviewsConfigInferred['worker_loaders']
	/**
	 * Specifies VPC services that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_services?: PreviewsConfigInferred['vpc_services']
	/**
	 * Specifies VPC networks that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_networks?: PreviewsConfigInferred['vpc_networks']
}
export const PreviewsConfig = z.strictObject({
	agent_memory: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Agent Memory namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Agent Memory binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Agent Memory namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the AI binding should be remote or not in local development'),
			staging: z.boolean().optional().describe('Type: boolean'),
		})
		.optional()
		.describe(
			'Binding to the AI project.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai'
		),
	ai_search: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search instance in the Worker.'),
				instance_name: z
					.string()
					.describe('The user-chosen instance name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the AI Search instance binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai_search_namespaces: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Whether the AI Search namespace binding should be remote in local development'
					),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	analytics_engine_datasets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the dataset in the Worker.'),
				dataset: z.string().optional().describe('The name of this dataset to write to.'),
			})
		)
		.optional()
		.describe(
			'Specifies analytics engine datasets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets\n\nDefault: []'
		),
	artifacts: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the Artifacts instance.'),
				namespace: z.string().describe('The namespace to use.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether to use the remote Artifacts service in local dev.'),
			})
		)
		.optional()
		.describe(
			'Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	browser: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Browser binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'A browser that will be usable from the Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering'
		),
	get cache() {
		return Interface76904064710589207117690406470526752004818536.optional()
	},
	cloudchamber: z
		.lazy(() => CloudchamberConfig)
		.optional()
		.describe(
			'Cloudchamber configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	containers: z
		.array(z.lazy(() => ContainerApp))
		.optional()
		.describe(
			'Container related configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	d1_databases: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the D1 database in the Worker.'),
				database_id: z.string().optional().describe('The UUID of this D1 database (not required).'),
				database_internal_env: z.string().optional().describe('Internal use only.'),
				database_name: z.string().optional().describe('The name of this D1 database.'),
				migrations_dir: z
					.string()
					.optional()
					.describe(
						"The path to the directory of migrations for this D1 database (defaults to './migrations')."
					),
				migrations_pattern: z
					.string()
					.optional()
					.describe(
						"A glob pattern (relative to the Wrangler config file) used to discover migration files for this D1 database. Defaults to `${migrations_dir}/*.sql` if not specified.\n\nUse this to opt in to nested layouts such as `migrations/*\\/migration.sql` (as produced by some ORMs).\n\nWhen `migrations_pattern` is set, `migrations_dir` must also be set, and `migrations_pattern` must start with `${migrations_dir}/`. This keeps the relationship between the two settings explicit and lets Wrangler record each migration's name in the migrations table as a path relative to `migrations_dir`."
					),
				migrations_table: z
					.string()
					.optional()
					.describe(
						"The name of the migrations table for this D1 database (defaults to 'd1_migrations')."
					),
				preview_database_id: z
					.string()
					.optional()
					.describe('The UUID of this D1 database for Wrangler Dev (if specified).'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the D1 database should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies D1 databases that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases\n\nDefault: []'
		),
	define: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A map of values to substitute when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	dispatch_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				namespace: z.string().describe('The namespace to bind to.'),
				outbound: z
					.lazy(() => DispatchNamespaceOutbound)
					.optional()
					.describe(
						'Details about the outbound Worker which will handle outbound requests from your namespace'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Dispatch Namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms\n\nDefault: []'
		),
	durable_objects: z
		.strictObject({
			bindings: z.lazy(() => DurableObjectBindings),
		})
		.optional()
		.describe(
			'A list of durable objects that your Worker should be bound to.\n\nFor more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects\n\nDefault: {"bindings":[]}'
		),
	flagship: z
		.array(
			z.strictObject({
				app_id: z.string().describe('The Flagship app ID to bind to.'),
				binding: z
					.string()
					.describe('The binding name used to refer to the bound Flagship service.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Set to `true` to suppress the remote binding warning in local dev. Flagship bindings are always remote.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies Flagship feature flag bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	hyperdrive: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the project in the Worker.'),
				id: z.string().describe('The id of the database.'),
				localConnectionString: z
					.string()
					.optional()
					.describe('The local database connection string for `wrangler dev`'),
			})
		)
		.optional()
		.describe(
			'Specifies Hyperdrive configs that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive\n\nDefault: []'
		),
	images: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Images binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Images\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images'
		),
	kv_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the KV Namespace'),
				id: z.string().optional().describe('The ID of the KV namespace'),
				preview_id: z
					.string()
					.optional()
					.describe('The ID of the KV namespace used during `wrangler dev`'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the KV namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify any Workers KV Namespaces you want to access from inside your Worker.\n\nTo learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces\n\nDefault: []'
		),
	get limits() {
		return Interface76904064710589207117690406470526752004818536.optional()
	},
	get logpush() {
		return Interface76904064710589207117690406470526752004818536.optional()
	},
	media: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z.boolean().optional().describe('Whether the Media binding should be remote or not'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Media Transformations\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	mtls_certificates: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the certificate in the Worker'),
				certificate_id: z.string().describe('The uuid of the uploaded mTLS certificate'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the mtls fetcher should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies a list of mTLS certificates that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates\n\nDefault: []'
		),
	get observability() {
		return Interface76904064710589207117690406470526752004818536.optional()
	},
	pipelines: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				pipeline: z.string().optional().describe('Id of the Stream to bind'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the pipeline should be remote or not in local development'),
				stream: z.string().optional().describe('Id of the Stream to bind'),
			})
		)
		.optional()
		.describe(
			'Specifies list of Pipelines bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	queues: z
		.strictObject({
			consumers: z
				.array(
					z.strictObject({
						queue: z
							.string()
							.describe('The name of the queue from which this consumer should consume.'),
						max_batch_size: z
							.number()
							.optional()
							.describe('The maximum number of messages per batch'),
						max_batch_timeout: z
							.number()
							.optional()
							.describe('The maximum number of seconds to wait to fill a batch with messages.'),
						max_concurrency: z
							.number()
							.nullable()
							.optional()
							.describe(
								'The maximum number of concurrent consumer Worker invocations. Leaving this unset will allow your consumer to scale to the maximum concurrency needed to keep up with the message backlog.'
							),
						max_retries: z
							.number()
							.optional()
							.describe('The maximum number of retries for each message.'),
						dead_letter_queue: z
							.string()
							.optional()
							.describe('The queue to send messages that failed to be consumed.'),
						retry_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before retrying a message'),
						type: z
							.literal('worker')
							.optional()
							.describe(
								'The consumer type. Only "worker" is supported in wrangler config. Default is "worker".'
							),
						visibility_timeout_ms: z
							.number()
							.optional()
							.describe(
								'The number of milliseconds to wait for pulled messages to become visible again'
							),
					})
				)
				.optional()
				.describe('Consumer configuration'),
			producers: z
				.array(
					z.strictObject({
						binding: z
							.string()
							.describe('The binding name used to refer to the Queue in the Worker.'),
						delivery_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before delivering a message'),
						queue: z.string().describe('The name of this Queue.'),
						remote: z
							.boolean()
							.optional()
							.describe('Whether the Queue producer should be remote or not in local development'),
					})
				)
				.optional()
				.describe('Producer bindings'),
		})
		.optional()
		.describe(
			'Specifies Queues that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues\n\nDefault: {"consumers":[],"producers":[]}'
		),
	r2_buckets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the R2 bucket in the Worker.'),
				bucket_name: z.string().optional().describe('The name of this R2 bucket at the edge.'),
				jurisdiction: z
					.string()
					.optional()
					.describe('The jurisdiction that the bucket exists in. Default if not present.'),
				preview_bucket_name: z
					.string()
					.optional()
					.describe('The preview name of this R2 bucket at the edge.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the R2 bucket should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies R2 buckets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets\n\nDefault: []'
		),
	ratelimits: z
		.array(
			z.strictObject({
				name: z
					.string()
					.describe('The binding name used to refer to the rate limiter in the Worker.'),
				namespace_id: z.string().describe('The namespace ID for this rate limiter.'),
				simple: z
					.strictObject({
						limit: z
							.number()
							.describe('The maximum number of requests allowed in the time period.'),
						period: z
							.union([z.literal(10), z.literal(60)])
							.describe('The time period in seconds (10 for ten seconds, 60 for one minute).'),
					})
					.describe('Simple rate limiting configuration.'),
			})
		)
		.optional()
		.describe(
			'Specifies rate limit bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	secrets: z
		.strictObject({
			required: z
				.array(z.string())
				.optional()
				.describe(
					'List of secret names that are required by your Worker. When defined, this property:\n- Replaces .dev.vars/.env/process.env inference for type generation\n- Enables local dev validation with warnings for missing secrets'
				),
		})
		.optional()
		.describe(
			'Secrets configuration.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property'
		),
	secrets_store_secrets: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				secret_name: z.string().describe('Name of the secret'),
				store_id: z.string().describe('Id of the secret store'),
			})
		)
		.optional()
		.describe(
			'Specifies Secret Store bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	send_email: z
		.array(
			z.strictObject({
				allowed_destination_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of verified addresses'),
				allowed_sender_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of sender addresses'),
				destination_address: z
					.string()
					.optional()
					.describe('If this binding should be restricted to a specific verified address'),
				name: z.string().describe('The binding name used to refer to the this binding'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the binding should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify bindings to send email from inside your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings\n\nDefault: []'
		),
	services: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				entrypoint: z
					.string()
					.optional()
					.describe('Optionally, the entrypoint (named export) of the service to bind to.'),
				props: z
					.looseObject({})
					.optional()
					.describe(
						'Optional properties that will be made available to the service via ctx.props.'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the service binding should be remote or not in local development'),
				service: z
					.string()
					.describe(
						'The name of the service. To bind to a worker in a specific environment, you should use the format `<worker_name>-<environment_name>`.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings\n\nDefault: []'
		),
	stream: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Stream binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Stream\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	streaming_tail_consumers: z
		.array(z.lazy(() => StreamingTailConsumer))
		.optional()
		.describe(
			'Specifies a list of Streaming Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	tail_consumers: z
		.array(z.lazy(() => TailConsumer))
		.optional()
		.describe(
			'Specifies a list of Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	unsafe: z
		.strictObject({
			bindings: z
				.array(
					z.looseObject({
						dev: z
							.strictObject({
								options: z
									.looseObject({})
									.optional()
									.describe(
										'Optional mapping of unsafe bindings names to options provided for the plugin.'
									),
								plugin: z
									.strictObject({
										name: z
											.string()
											.describe('Plugin is the name of the plugin exposed by the package.'),
										package: z
											.string()
											.describe(
												'Package is the bare specifier of the package that exposes plugins to integrate into Miniflare via a named `plugins` export.'
											),
									})
									.describe('Type: object'),
							})
							.optional()
							.describe('Type: object'),
						name: z.string().describe('The name of the binding provided to the Worker'),
						type: z.string().describe("The 'type' of the unsafe binding."),
					})
				)
				.optional()
				.describe(
					"A set of bindings that should be put into a Worker's upload metadata without changes. These can be used to implement bindings for features that haven't released and aren't supported directly by wrangler or miniflare."
				),
			capnp: z
				.union([
					z.strictObject({
						base_path: z.string().describe('Type: string'),
						source_schemas: z.array(z.string()).describe('Type: array'),
					}),
					z.strictObject({
						compiled_schema: z.string().describe('Type: string'),
					}),
				])
				.optional()
				.describe('Used for internal capnp uploads for the Workers runtime'),
			metadata: z
				.looseObject({})
				.optional()
				.describe(
					'Arbitrary key/value pairs that will be included in the uploaded metadata.  Values specified here will always be applied to metadata last, so can add new or override existing fields.'
				),
		})
		.optional()
		.describe(
			'"Unsafe" tables for features that aren\'t directly supported by wrangler.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	unsafe_hello_world: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				enable_timer: z.boolean().optional().describe('Whether the timer is enabled'),
			})
		)
		.optional()
		.describe(
			'**DO NOT USE**. Hello World Binding Config to serve as an explanatory example.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	vars: z
		.looseObject({})
		.catchall(z.union([z.string(), z.lazy(() => Json)]))
		.optional()
		.describe(
			'A map of environment variables to set when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables\n\nDefault: {}'
		),
	vectorize: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Vectorize index in the Worker.'),
				index_name: z.string().describe('The name of the index.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Vectorize index should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Vectorize indexes that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes\n\nDefault: []'
		),
	version_metadata: z
		.strictObject({
			binding: z.string().describe('Type: string'),
		})
		.optional()
		.describe("Binding to the Worker Version's metadata"),
	vpc_networks: z
		.array(
			z.union([
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
					tunnel_id: z
						.string()
						.describe(
							'The tunnel ID of the Cloudflare Tunnel to route traffic through. Mutually exclusive with network_id.'
						),
				}),
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					network_id: z
						.string()
						.describe(
							'The network ID to route traffic through. Mutually exclusive with tunnel_id.'
						),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
				}),
			])
		)
		.optional()
		.describe(
			'Specifies VPC networks that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	vpc_services: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the VPC service in the Worker.'),
				remote: z.boolean().optional().describe('Whether the VPC service is remote or not'),
				service_id: z.string().describe('The service ID of the VPC connectivity service.'),
			})
		)
		.optional()
		.describe(
			'Specifies VPC services that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	websearch: z
		.strictObject({
			binding: z.string().describe('The binding name used to refer to Web Search in the Worker.'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Web Search binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	worker_loaders: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Worker Loader in the Worker.'),
			})
		)
		.optional()
		.describe(
			'Specifies Worker Loader bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	workflows: z
		.array(z.lazy(() => WorkflowBinding))
		.optional()
		.describe(
			'A list of workflows that your Worker should be bound to.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
})

/**
 * Type: object
 */
type WranglerConfigInferred = z.infer<typeof WranglerConfig>
export interface WranglerConfig extends WranglerConfigInferred {
	/**
	 * Type: string
	 */
	$schema?: WranglerConfigInferred['$schema']
	/**
	 * The `env` section defines overrides for the configuration for different environments.
	 *
	 * All environment fields can be specified at the top level of the config indicating the default environment settings.
	 *
	 * - Some fields are inherited and overridable in each environment.
	 * - But some are not inherited and must be explicitly specified in every environment, if they are specified at the top level.
	 *
	 * For more information, see the documentation at https://developers.cloudflare.com/workers/cli-wrangler/configuration#environments
	 *
	 * @default {}
	 */
	env?: WranglerConfigInferred['env']
	/**
	 * The name of your Worker. Alphanumeric + dashes only.
	 */
	name?: WranglerConfigInferred['name']
	/**
	 * This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.
	 */
	account_id?: WranglerConfigInferred['account_id']
	/**
	 * A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-dates
	 */
	compatibility_date?: WranglerConfigInferred['compatibility_date']
	/**
	 * A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/
	 *
	 * @default []
	 */
	compatibility_flags?: WranglerConfigInferred['compatibility_flags']
	/**
	 * The entrypoint/path to the JavaScript file that will be executed.
	 */
	main?: WranglerConfigInferred['main']
	/**
	 * If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.
	 */
	find_additional_modules?: WranglerConfigInferred['find_additional_modules']
	/**
	 * Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.
	 */
	preserve_file_names?: WranglerConfigInferred['preserve_file_names']
	/**
	 * The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.
	 */
	base_dir?: WranglerConfigInferred['base_dir']
	/**
	 * Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
	 *
	 * @default true
	 */
	workers_dev?: WranglerConfigInferred['workers_dev']
	/**
	 * Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.
	 *
	 * @default false
	 */
	preview_urls?: WranglerConfigInferred['preview_urls']
	/**
	 * A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker (see `triggers`)
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes
	 */
	routes?: WranglerConfigInferred['routes']
	/**
	 * A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker
	 */
	route?: WranglerConfigInferred['route']
	/**
	 * Path to a custom tsconfig
	 */
	tsconfig?: WranglerConfigInferred['tsconfig']
	/**
	 * The function to use to replace jsx syntax.
	 *
	 * @default "React.createElement"
	 */
	jsx_factory?: WranglerConfigInferred['jsx_factory']
	/**
	 * The function to use to replace jsx fragment syntax.
	 *
	 * @default "React.Fragment"
	 */
	jsx_fragment?: WranglerConfigInferred['jsx_fragment']
	/**
	 * A list of migrations that should be uploaded with your Worker.
	 *
	 * These define changes in your Durable Object declarations.
	 *
	 * More details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations
	 *
	 * @default []
	 */
	migrations?: WranglerConfigInferred['migrations']
	/**
	 * Declarative exports configuration — a map of class name to export configuration.
	 *
	 * The configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.
	 *
	 * @default {}
	 */
	exports?: WranglerConfigInferred['exports']
	/**
	 * "Cron" definitions to trigger a Worker's "scheduled" function.
	 *
	 * Lets you call Workers periodically, much like a cron job.
	 *
	 * More details here https://developers.cloudflare.com/workers/platform/cron-triggers
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers
	 *
	 * @default {"crons":[]}
	 */
	triggers?: WranglerConfigInferred['triggers']
	/**
	 * Specify limits for runtime behavior. Only supported for the "standard" Usage Model
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits
	 */
	limits?: WranglerConfigInferred['limits']
	/**
	 * An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling
	 */
	rules?: WranglerConfigInferred['rules']
	/**
	 * Configures a custom build step to be run by Wrangler when building your Worker.
	 *
	 * Refer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds
	 *
	 * @default {"watch_dir":"./src"}
	 */
	build?: WranglerConfigInferred['build']
	/**
	 * Skip internal build steps and directly deploy script
	 */
	no_bundle?: WranglerConfigInferred['no_bundle']
	/**
	 * Minify the script before uploading.
	 */
	minify?: WranglerConfigInferred['minify']
	/**
	 * Set the `name` property to the original name for functions and classes renamed during minification.
	 *
	 * See https://esbuild.github.io/api/#keep-names
	 *
	 * @default true
	 */
	keep_names?: WranglerConfigInferred['keep_names']
	/**
	 * Designates this Worker as an internal-only "first-party" Worker.
	 */
	first_party_worker?: WranglerConfigInferred['first_party_worker']
	/**
	 * List of bindings that you will send to logfwdr
	 *
	 * @default {"bindings":[]}
	 */
	logfwdr?: WranglerConfigInferred['logfwdr']
	/**
	 * Send Trace Events from this Worker to Workers Logpush.
	 *
	 * This will not configure a corresponding Logpush job automatically.
	 *
	 * For more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/
	 */
	logpush?: WranglerConfigInferred['logpush']
	/**
	 * Include source maps when uploading this worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps
	 */
	upload_source_maps?: WranglerConfigInferred['upload_source_maps']
	/**
	 * Specify how the Worker should be located to minimize round-trip time.
	 *
	 * More details: https://developers.cloudflare.com/workers/platform/smart-placement/
	 */
	placement?: WranglerConfigInferred['placement']
	/**
	 * Specify the directory of static assets to deploy/serve
	 *
	 * More details at https://developers.cloudflare.com/workers/frameworks/
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets
	 */
	assets?: WranglerConfigInferred['assets']
	/**
	 * Specify the observability behavior of the Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability
	 */
	observability?: WranglerConfigInferred['observability']
	/**
	 * Specify the cache behavior of the Worker.
	 */
	cache?: WranglerConfigInferred['cache']
	/**
	 * Specify the compliance region mode of the Worker.
	 *
	 * Although if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.
	 */
	compliance_region?: WranglerConfigInferred['compliance_region']
	/**
	 * Configuration for Python modules.
	 */
	python_modules?: WranglerConfigInferred['python_modules']
	/**
	 * Configuration for Worker Previews.
	 *
	 * Previews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews
	 */
	previews?: WranglerConfigInferred['previews']
	/**
	 * A map of values to substitute when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	define?: WranglerConfigInferred['define']
	/**
	 * A map of environment variables to set when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
	 *
	 * @default {}
	 */
	vars?: WranglerConfigInferred['vars']
	/**
	 * Secrets configuration.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property
	 */
	secrets?: WranglerConfigInferred['secrets']
	/**
	 * A list of durable objects that your Worker should be bound to.
	 *
	 * For more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects
	 *
	 * @default {"bindings":[]}
	 */
	durable_objects?: WranglerConfigInferred['durable_objects']
	/**
	 * A list of workflows that your Worker should be bound to.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	workflows?: WranglerConfigInferred['workflows']
	/**
	 * Cloudchamber configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	cloudchamber?: WranglerConfigInferred['cloudchamber']
	/**
	 * Container related configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	containers?: WranglerConfigInferred['containers']
	/**
	 * These specify any Workers KV Namespaces you want to access from inside your Worker.
	 *
	 * To learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces
	 *
	 * @default []
	 */
	kv_namespaces?: WranglerConfigInferred['kv_namespaces']
	/**
	 * These specify bindings to send email from inside your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings
	 *
	 * @default []
	 */
	send_email?: WranglerConfigInferred['send_email']
	/**
	 * Specifies Queues that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues
	 *
	 * @default {"consumers":[],"producers":[]}
	 */
	queues?: WranglerConfigInferred['queues']
	/**
	 * Specifies R2 buckets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets
	 *
	 * @default []
	 */
	r2_buckets?: WranglerConfigInferred['r2_buckets']
	/**
	 * Specifies D1 databases that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases
	 *
	 * @default []
	 */
	d1_databases?: WranglerConfigInferred['d1_databases']
	/**
	 * Specifies Vectorize indexes that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes
	 *
	 * @default []
	 */
	vectorize?: WranglerConfigInferred['vectorize']
	/**
	 * Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search_namespaces?: WranglerConfigInferred['ai_search_namespaces']
	/**
	 * Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search?: WranglerConfigInferred['ai_search']
	/**
	 * Specifies Agent Memory namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	agent_memory?: WranglerConfigInferred['agent_memory']
	/**
	 * Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	websearch?: WranglerConfigInferred['websearch']
	/**
	 * Specifies Hyperdrive configs that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive
	 *
	 * @default []
	 */
	hyperdrive?: WranglerConfigInferred['hyperdrive']
	/**
	 * Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings
	 *
	 * @default []
	 */
	services?: WranglerConfigInferred['services']
	/**
	 * Specifies analytics engine datasets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets
	 *
	 * @default []
	 */
	analytics_engine_datasets?: WranglerConfigInferred['analytics_engine_datasets']
	/**
	 * A browser that will be usable from the Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering
	 */
	browser?: WranglerConfigInferred['browser']
	/**
	 * Binding to the AI project.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai
	 */
	ai?: WranglerConfigInferred['ai']
	/**
	 * Binding to Cloudflare Images
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images
	 */
	images?: WranglerConfigInferred['images']
	/**
	 * Binding to Cloudflare Media Transformations
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	media?: WranglerConfigInferred['media']
	/**
	 * Binding to Cloudflare Stream
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	stream?: WranglerConfigInferred['stream']
	/**
	 * Binding to the Worker Version's metadata
	 */
	version_metadata?: WranglerConfigInferred['version_metadata']
	/**
	 * "Unsafe" tables for features that aren't directly supported by wrangler.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	unsafe?: WranglerConfigInferred['unsafe']
	/**
	 * Specifies a list of mTLS certificates that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates
	 *
	 * @default []
	 */
	mtls_certificates?: WranglerConfigInferred['mtls_certificates']
	/**
	 * Specifies a list of Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	tail_consumers?: WranglerConfigInferred['tail_consumers']
	/**
	 * Specifies a list of Streaming Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	streaming_tail_consumers?: WranglerConfigInferred['streaming_tail_consumers']
	/**
	 * Specifies namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms
	 *
	 * @default []
	 */
	dispatch_namespaces?: WranglerConfigInferred['dispatch_namespaces']
	/**
	 * Specifies list of Pipelines bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	pipelines?: WranglerConfigInferred['pipelines']
	/**
	 * Specifies Secret Store bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	secrets_store_secrets?: WranglerConfigInferred['secrets_store_secrets']
	/**
	 * Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	artifacts?: WranglerConfigInferred['artifacts']
	/**
	 * **DO NOT USE**. Hello World Binding Config to serve as an explanatory example.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	unsafe_hello_world?: WranglerConfigInferred['unsafe_hello_world']
	/**
	 * Specifies Flagship feature flag bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	flagship?: WranglerConfigInferred['flagship']
	/**
	 * Specifies rate limit bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ratelimits?: WranglerConfigInferred['ratelimits']
	/**
	 * Specifies Worker Loader bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	worker_loaders?: WranglerConfigInferred['worker_loaders']
	/**
	 * Specifies VPC services that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_services?: WranglerConfigInferred['vpc_services']
	/**
	 * Specifies VPC networks that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_networks?: WranglerConfigInferred['vpc_networks']
	/**
	 * The directory of static assets to serve.
	 *
	 * The presence of this field in a Wrangler configuration file indicates a Pages project, and will prompt the handling of the configuration file according to the Pages-specific validation rules.
	 */
	pages_build_output_dir?: WranglerConfigInferred['pages_build_output_dir']
	/**
	 * Whether Wrangler should send usage metrics to Cloudflare for this project.
	 *
	 * When defined this will override any user settings. Otherwise, Wrangler will use the user's preference.
	 */
	send_metrics?: WranglerConfigInferred['send_metrics']
	/**
	 * Configuration for npm package dependency instrumentation.
	 *
	 * Controls whether Wrangler should collect and send npm package dependency metadata when deploying or uploading a Worker version.
	 *
	 * When `enabled` is set to `false`, Wrangler will not include `package_dependencies` in the upload payload. Defaults to enabled when not specified.
	 *
	 * Note: This is considered build metadata, so managed separately from the       telemetry one and not disabled when       `send_metrics`/`WRANGLER_SEND_METRICS` is set to `false`
	 */
	dependencies_instrumentation?: WranglerConfigInferred['dependencies_instrumentation']
	/**
	 * Options to configure the development server that your worker will use.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#local-development-settings
	 */
	dev?: WranglerConfigInferred['dev']
	/**
	 * The definition of a Worker Site, a feature that lets you upload static assets with your Worker.
	 *
	 * More details at https://developers.cloudflare.com/workers/platform/sites
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-sites
	 */
	site?: WranglerConfigInferred['site']
	/**
	 * A list of wasm modules that your worker should be bound to. This is the "legacy" way of binding to a wasm module. ES module workers should do proper module imports.
	 */
	wasm_modules?: WranglerConfigInferred['wasm_modules']
	/**
	 * A list of text files that your worker should be bound to. This is the "legacy" way of binding to a text file. ES module workers should do proper module imports.
	 */
	text_blobs?: WranglerConfigInferred['text_blobs']
	/**
	 * A list of data files that your worker should be bound to. This is the "legacy" way of binding to a data file. ES module workers should do proper module imports.
	 */
	data_blobs?: WranglerConfigInferred['data_blobs']
	/**
	 * A map of module aliases. Lets you swap out a module for any others. Corresponds with esbuild's `alias` config
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing
	 */
	alias?: WranglerConfigInferred['alias']
	/**
	 * By default, the Wrangler configuration file is the source of truth for your environment configuration, like a terraform file.
	 *
	 * If you change your vars in the dashboard, wrangler *will* override/delete them on its next deploy.
	 *
	 * If you want to keep your dashboard vars when wrangler deploys, set this field to true.
	 *
	 * @default false
	 */
	keep_vars?: WranglerConfigInferred['keep_vars']
}
export const WranglerConfig = z.strictObject({
	$schema: z.string().optional().describe('Type: string'),
	name: z.string().optional().describe('The name of your Worker. Alphanumeric + dashes only.'),
	account_id: z
		.string()
		.optional()
		.describe(
			'This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.'
		),
	main: z
		.string()
		.optional()
		.describe('The entrypoint/path to the JavaScript file that will be executed.'),
	compatibility_date: z
		.string()
		.optional()
		.describe(
			'A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-dates'
		),
	compatibility_flags: z
		.array(z.string())
		.optional()
		.describe(
			'A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/\n\nDefault: []'
		),
	workers_dev: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev\n\nDefault: true'
		),
	preview_urls: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.\n\nDefault: false'
		),
	logpush: z
		.boolean()
		.optional()
		.describe(
			'Send Trace Events from this Worker to Workers Logpush.\n\nThis will not configure a corresponding Logpush job automatically.\n\nFor more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/'
		),
	routes: z
		.array(z.lazy(() => Route))
		.optional()
		.describe(
			"A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker (see `triggers`)\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes"
		),
	route: z
		.lazy(() => Route)
		.optional()
		.describe(
			"A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker"
		),
	assets: z
		.lazy(() => Assets)
		.optional()
		.describe(
			'Specify the directory of static assets to deploy/serve\n\nMore details at https://developers.cloudflare.com/workers/frameworks/\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets'
		),
	observability: z
		.lazy(() => Observability)
		.optional()
		.describe(
			'Specify the observability behavior of the Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability'
		),
	placement: z
		.union([
			z.strictObject({
				hint: z.string().optional().describe('Type: string'),
				mode: z.enum(['off', 'smart']).describe('Allowed values: "off", "smart"'),
			}),
			z.strictObject({
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
				region: z.string().describe('Type: string'),
			}),
			z.strictObject({
				host: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
			z.strictObject({
				hostname: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
		])
		.optional()
		.describe(
			'Specify how the Worker should be located to minimize round-trip time.\n\nMore details: https://developers.cloudflare.com/workers/platform/smart-placement/'
		),
	secrets_store_secrets: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				secret_name: z.string().describe('Name of the secret'),
				store_id: z.string().describe('Id of the secret store'),
			})
		)
		.optional()
		.describe(
			'Specifies Secret Store bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	tail_consumers: z
		.array(z.lazy(() => TailConsumer))
		.optional()
		.describe(
			'Specifies a list of Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	vars: z
		.looseObject({})
		.catchall(z.union([z.string(), z.lazy(() => Json)]))
		.optional()
		.describe(
			'A map of environment variables to set when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables\n\nDefault: {}'
		),
	kv_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the KV Namespace'),
				id: z.string().optional().describe('The ID of the KV namespace'),
				preview_id: z
					.string()
					.optional()
					.describe('The ID of the KV namespace used during `wrangler dev`'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the KV namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify any Workers KV Namespaces you want to access from inside your Worker.\n\nTo learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces\n\nDefault: []'
		),
	analytics_engine_datasets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the dataset in the Worker.'),
				dataset: z.string().optional().describe('The name of this dataset to write to.'),
			})
		)
		.optional()
		.describe(
			'Specifies analytics engine datasets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets\n\nDefault: []'
		),
	r2_buckets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the R2 bucket in the Worker.'),
				bucket_name: z.string().optional().describe('The name of this R2 bucket at the edge.'),
				jurisdiction: z
					.string()
					.optional()
					.describe('The jurisdiction that the bucket exists in. Default if not present.'),
				preview_bucket_name: z
					.string()
					.optional()
					.describe('The preview name of this R2 bucket at the edge.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the R2 bucket should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies R2 buckets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets\n\nDefault: []'
		),
	triggers: z
		.strictObject({
			crons: z.array(z.string()).optional().describe('Type: array'),
		})
		.optional()
		.describe(
			'"Cron" definitions to trigger a Worker\'s "scheduled" function.\n\nLets you call Workers periodically, much like a cron job.\n\nMore details here https://developers.cloudflare.com/workers/platform/cron-triggers\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers\n\nDefault: {"crons":[]}'
		),
	limits: z
		.lazy(() => UserLimits)
		.optional()
		.describe(
			'Specify limits for runtime behavior. Only supported for the "standard" Usage Model\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits'
		),
	containers: z
		.array(z.lazy(() => ContainerApp))
		.optional()
		.describe(
			'Container related configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	images: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Images binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Images\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images'
		),
	worker_loaders: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Worker Loader in the Worker.'),
			})
		)
		.optional()
		.describe(
			'Specifies Worker Loader bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	services: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				entrypoint: z
					.string()
					.optional()
					.describe('Optionally, the entrypoint (named export) of the service to bind to.'),
				props: z
					.looseObject({})
					.optional()
					.describe(
						'Optional properties that will be made available to the service via ctx.props.'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the service binding should be remote or not in local development'),
				service: z
					.string()
					.describe(
						'The name of the service. To bind to a worker in a specific environment, you should use the format `<worker_name>-<environment_name>`.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings\n\nDefault: []'
		),
	hyperdrive: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the project in the Worker.'),
				id: z.string().describe('The id of the database.'),
				localConnectionString: z
					.string()
					.optional()
					.describe('The local database connection string for `wrangler dev`'),
			})
		)
		.optional()
		.describe(
			'Specifies Hyperdrive configs that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive\n\nDefault: []'
		),
	ratelimits: z
		.array(
			z.strictObject({
				name: z
					.string()
					.describe('The binding name used to refer to the rate limiter in the Worker.'),
				namespace_id: z.string().describe('The namespace ID for this rate limiter.'),
				simple: z
					.strictObject({
						limit: z
							.number()
							.describe('The maximum number of requests allowed in the time period.'),
						period: z
							.union([z.literal(10), z.literal(60)])
							.describe('The time period in seconds (10 for ten seconds, 60 for one minute).'),
					})
					.describe('Simple rate limiting configuration.'),
			})
		)
		.optional()
		.describe(
			'Specifies rate limit bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	d1_databases: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the D1 database in the Worker.'),
				database_id: z.string().optional().describe('The UUID of this D1 database (not required).'),
				database_internal_env: z.string().optional().describe('Internal use only.'),
				database_name: z.string().optional().describe('The name of this D1 database.'),
				migrations_dir: z
					.string()
					.optional()
					.describe(
						"The path to the directory of migrations for this D1 database (defaults to './migrations')."
					),
				migrations_pattern: z
					.string()
					.optional()
					.describe(
						"A glob pattern (relative to the Wrangler config file) used to discover migration files for this D1 database. Defaults to `${migrations_dir}/*.sql` if not specified.\n\nUse this to opt in to nested layouts such as `migrations/*\\/migration.sql` (as produced by some ORMs).\n\nWhen `migrations_pattern` is set, `migrations_dir` must also be set, and `migrations_pattern` must start with `${migrations_dir}/`. This keeps the relationship between the two settings explicit and lets Wrangler record each migration's name in the migrations table as a path relative to `migrations_dir`."
					),
				migrations_table: z
					.string()
					.optional()
					.describe(
						"The name of the migrations table for this D1 database (defaults to 'd1_migrations')."
					),
				preview_database_id: z
					.string()
					.optional()
					.describe('The UUID of this D1 database for Wrangler Dev (if specified).'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the D1 database should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies D1 databases that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases\n\nDefault: []'
		),
	ai: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the AI binding should be remote or not in local development'),
			staging: z.boolean().optional().describe('Type: boolean'),
		})
		.optional()
		.describe(
			'Binding to the AI project.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai'
		),
	rules: z
		.array(z.lazy(() => Rule))
		.optional()
		.describe(
			'An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling'
		),
	durable_objects: z
		.strictObject({
			bindings: z.lazy(() => DurableObjectBindings),
		})
		.optional()
		.describe(
			'A list of durable objects that your Worker should be bound to.\n\nFor more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects\n\nDefault: {"bindings":[]}'
		),
	pipelines: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				pipeline: z.string().optional().describe('Id of the Stream to bind'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the pipeline should be remote or not in local development'),
				stream: z.string().optional().describe('Id of the Stream to bind'),
			})
		)
		.optional()
		.describe(
			'Specifies list of Pipelines bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	queues: z
		.strictObject({
			consumers: z
				.array(
					z.strictObject({
						queue: z
							.string()
							.describe('The name of the queue from which this consumer should consume.'),
						max_batch_size: z
							.number()
							.optional()
							.describe('The maximum number of messages per batch'),
						max_batch_timeout: z
							.number()
							.optional()
							.describe('The maximum number of seconds to wait to fill a batch with messages.'),
						max_concurrency: z
							.number()
							.nullable()
							.optional()
							.describe(
								'The maximum number of concurrent consumer Worker invocations. Leaving this unset will allow your consumer to scale to the maximum concurrency needed to keep up with the message backlog.'
							),
						max_retries: z
							.number()
							.optional()
							.describe('The maximum number of retries for each message.'),
						dead_letter_queue: z
							.string()
							.optional()
							.describe('The queue to send messages that failed to be consumed.'),
						retry_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before retrying a message'),
						type: z
							.literal('worker')
							.optional()
							.describe(
								'The consumer type. Only "worker" is supported in wrangler config. Default is "worker".'
							),
						visibility_timeout_ms: z
							.number()
							.optional()
							.describe(
								'The number of milliseconds to wait for pulled messages to become visible again'
							),
					})
				)
				.optional()
				.describe('Consumer configuration'),
			producers: z
				.array(
					z.strictObject({
						binding: z
							.string()
							.describe('The binding name used to refer to the Queue in the Worker.'),
						delivery_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before delivering a message'),
						queue: z.string().describe('The name of this Queue.'),
						remote: z
							.boolean()
							.optional()
							.describe('Whether the Queue producer should be remote or not in local development'),
					})
				)
				.optional()
				.describe('Producer bindings'),
		})
		.optional()
		.describe(
			'Specifies Queues that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues\n\nDefault: {"consumers":[],"producers":[]}'
		),
	workflows: z
		.array(z.lazy(() => WorkflowBinding))
		.optional()
		.describe(
			'A list of workflows that your Worker should be bound to.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	migrations: z
		.array(z.lazy(() => DurableObjectMigration))
		.optional()
		.describe(
			'A list of migrations that should be uploaded with your Worker.\n\nThese define changes in your Durable Object declarations.\n\nMore details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations\n\nDefault: []'
		),
	vpc_services: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the VPC service in the Worker.'),
				remote: z.boolean().optional().describe('Whether the VPC service is remote or not'),
				service_id: z.string().describe('The service ID of the VPC connectivity service.'),
			})
		)
		.optional()
		.describe(
			'Specifies VPC services that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	version_metadata: z
		.strictObject({
			binding: z.string().describe('Type: string'),
		})
		.optional()
		.describe("Binding to the Worker Version's metadata"),
	agent_memory: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Agent Memory namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Agent Memory binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Agent Memory namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai_search: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search instance in the Worker.'),
				instance_name: z
					.string()
					.describe('The user-chosen instance name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the AI Search instance binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai_search_namespaces: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Whether the AI Search namespace binding should be remote in local development'
					),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	alias: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			"A map of module aliases. Lets you swap out a module for any others. Corresponds with esbuild's `alias` config\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing"
		),
	artifacts: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the Artifacts instance.'),
				namespace: z.string().describe('The namespace to use.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether to use the remote Artifacts service in local dev.'),
			})
		)
		.optional()
		.describe(
			'Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	base_dir: z
		.string()
		.optional()
		.describe(
			'The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.'
		),
	browser: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Browser binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'A browser that will be usable from the Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering'
		),
	build: z
		.strictObject({
			command: z
				.string()
				.optional()
				.describe(
					'The command used to build your Worker. On Linux and macOS, the command is executed in the `sh` shell and the `cmd` shell for Windows. The `&&` and `||` shell operators may be used.'
				),
			cwd: z.string().optional().describe('The directory in which the command is executed.'),
			watch_dir: z
				.union([z.string(), z.array(z.string())])
				.optional()
				.describe(
					'The directory to watch for changes while using wrangler dev, defaults to the current working directory'
				),
		})
		.optional()
		.describe(
			'Configures a custom build step to be run by Wrangler when building your Worker.\n\nRefer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds\n\nDefault: {"watch_dir":"./src"}'
		),
	cache: z
		.lazy(() => CacheOptions)
		.optional()
		.describe('Specify the cache behavior of the Worker.'),
	cloudchamber: z
		.lazy(() => CloudchamberConfig)
		.optional()
		.describe(
			'Cloudchamber configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	compliance_region: z
		.enum(['public', 'fedramp_high'])
		.optional()
		.describe(
			'Specify the compliance region mode of the Worker.\n\nAlthough if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.'
		),
	data_blobs: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A list of data files that your worker should be bound to. This is the "legacy" way of binding to a data file. ES module workers should do proper module imports.'
		),
	define: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A map of values to substitute when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	dependencies_instrumentation: z
		.strictObject({
			enabled: z
				.boolean()
				.describe('Whether dependency instrumentation is enabled. Defaults to `true`.'),
		})
		.optional()
		.describe(
			'Configuration for npm package dependency instrumentation.\n\nControls whether Wrangler should collect and send npm package dependency metadata when deploying or uploading a Worker version.\n\nWhen `enabled` is set to `false`, Wrangler will not include `package_dependencies` in the upload payload. Defaults to enabled when not specified.\n\nNote: This is considered build metadata, so managed separately from the       telemetry one and not disabled when       `send_metrics`/`WRANGLER_SEND_METRICS` is set to `false`'
		),
	dev: z
		.lazy(() => RawDevConfig)
		.optional()
		.describe(
			'Options to configure the development server that your worker will use.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#local-development-settings'
		),
	dispatch_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				namespace: z.string().describe('The namespace to bind to.'),
				outbound: z
					.lazy(() => DispatchNamespaceOutbound)
					.optional()
					.describe(
						'Details about the outbound Worker which will handle outbound requests from your namespace'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Dispatch Namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms\n\nDefault: []'
		),
	env: z
		.looseObject({})
		.catchall(z.lazy(() => RawEnvironment))
		.optional()
		.describe(
			'The `env` section defines overrides for the configuration for different environments.\n\nAll environment fields can be specified at the top level of the config indicating the default environment settings.\n\n- Some fields are inherited and overridable in each environment.\n- But some are not inherited and must be explicitly specified in every environment, if they are specified at the top level.\n\nFor more information, see the documentation at https://developers.cloudflare.com/workers/cli-wrangler/configuration#environments\n\nDefault: {}'
		),
	exports: z
		.lazy(() => Exports)
		.optional()
		.describe(
			'Declarative exports configuration — a map of class name to export configuration.\n\nThe configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.\n\nDefault: {}'
		),
	find_additional_modules: z
		.boolean()
		.optional()
		.describe(
			'If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.'
		),
	first_party_worker: z
		.boolean()
		.optional()
		.describe('Designates this Worker as an internal-only "first-party" Worker.'),
	flagship: z
		.array(
			z.strictObject({
				app_id: z.string().describe('The Flagship app ID to bind to.'),
				binding: z
					.string()
					.describe('The binding name used to refer to the bound Flagship service.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Set to `true` to suppress the remote binding warning in local dev. Flagship bindings are always remote.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies Flagship feature flag bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	jsx_factory: z
		.string()
		.optional()
		.describe('The function to use to replace jsx syntax.\n\nDefault: "React.createElement"'),
	jsx_fragment: z
		.string()
		.optional()
		.describe('The function to use to replace jsx fragment syntax.\n\nDefault: "React.Fragment"'),
	keep_names: z
		.boolean()
		.optional()
		.describe(
			'Set the `name` property to the original name for functions and classes renamed during minification.\n\nSee https://esbuild.github.io/api/#keep-names\n\nDefault: true'
		),
	keep_vars: z
		.boolean()
		.optional()
		.describe(
			'By default, the Wrangler configuration file is the source of truth for your environment configuration, like a terraform file.\n\nIf you change your vars in the dashboard, wrangler *will* override/delete them on its next deploy.\n\nIf you want to keep your dashboard vars when wrangler deploys, set this field to true.\n\nDefault: false'
		),
	logfwdr: z
		.strictObject({
			bindings: z
				.array(
					z.strictObject({
						destination: z.string().describe('The destination for this logged message'),
						name: z.string().describe('The binding name used to refer to logfwdr'),
					})
				)
				.describe('Type: array'),
		})
		.optional()
		.describe('List of bindings that you will send to logfwdr\n\nDefault: {"bindings":[]}'),
	media: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z.boolean().optional().describe('Whether the Media binding should be remote or not'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Media Transformations\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	minify: z.boolean().optional().describe('Minify the script before uploading.'),
	mtls_certificates: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the certificate in the Worker'),
				certificate_id: z.string().describe('The uuid of the uploaded mTLS certificate'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the mtls fetcher should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies a list of mTLS certificates that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates\n\nDefault: []'
		),
	no_bundle: z
		.boolean()
		.optional()
		.describe('Skip internal build steps and directly deploy script'),
	pages_build_output_dir: z
		.string()
		.optional()
		.describe(
			'The directory of static assets to serve.\n\nThe presence of this field in a Wrangler configuration file indicates a Pages project, and will prompt the handling of the configuration file according to the Pages-specific validation rules.'
		),
	preserve_file_names: z
		.boolean()
		.optional()
		.describe(
			'Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.'
		),
	previews: z
		.lazy(() => PreviewsConfig)
		.optional()
		.describe(
			"Configuration for Worker Previews.\n\nPreviews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews"
		),
	python_modules: z
		.strictObject({
			exclude: z
				.array(z.string())
				.describe(
					'A list of glob patterns to exclude files from the python_modules directory when bundling.\n\nPatterns are relative to the python_modules directory and use glob syntax.\n\nDefault: ["***.pyc"]'
				),
		})
		.optional()
		.describe('Configuration for Python modules.'),
	secrets: z
		.strictObject({
			required: z
				.array(z.string())
				.optional()
				.describe(
					'List of secret names that are required by your Worker. When defined, this property:\n- Replaces .dev.vars/.env/process.env inference for type generation\n- Enables local dev validation with warnings for missing secrets'
				),
		})
		.optional()
		.describe(
			'Secrets configuration.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property'
		),
	send_email: z
		.array(
			z.strictObject({
				allowed_destination_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of verified addresses'),
				allowed_sender_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of sender addresses'),
				destination_address: z
					.string()
					.optional()
					.describe('If this binding should be restricted to a specific verified address'),
				name: z.string().describe('The binding name used to refer to the this binding'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the binding should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify bindings to send email from inside your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings\n\nDefault: []'
		),
	send_metrics: z
		.boolean()
		.optional()
		.describe(
			"Whether Wrangler should send usage metrics to Cloudflare for this project.\n\nWhen defined this will override any user settings. Otherwise, Wrangler will use the user's preference."
		),
	site: z
		.strictObject({
			bucket: z
				.string()
				.describe(
					'The directory containing your static assets.\n\nIt must be a path relative to your Wrangler configuration file. Example: bucket = "./public"\n\nIf there is a `site` field then it must contain this `bucket` field.'
				),
			'entry-point': z.string().optional().describe('The location of your Worker script.'),
			exclude: z
				.array(z.string())
				.optional()
				.describe(
					'A list of .gitignore-style patterns that match files or directories in your bucket that should be excluded from uploads. Example: exclude = ["ignore_dir"]\n\nDefault: []'
				),
			include: z
				.array(z.string())
				.optional()
				.describe(
					'An exclusive list of .gitignore-style patterns that match file or directory names from your bucket location. Only matched items will be uploaded. Example: include = ["upload_dir"]\n\nDefault: []'
				),
		})
		.optional()
		.describe(
			'The definition of a Worker Site, a feature that lets you upload static assets with your Worker.\n\nMore details at https://developers.cloudflare.com/workers/platform/sites\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-sites'
		),
	stream: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Stream binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Stream\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	streaming_tail_consumers: z
		.array(z.lazy(() => StreamingTailConsumer))
		.optional()
		.describe(
			'Specifies a list of Streaming Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	text_blobs: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A list of text files that your worker should be bound to. This is the "legacy" way of binding to a text file. ES module workers should do proper module imports.'
		),
	tsconfig: z.string().optional().describe('Path to a custom tsconfig'),
	unsafe: z
		.strictObject({
			bindings: z
				.array(
					z.looseObject({
						dev: z
							.strictObject({
								options: z
									.looseObject({})
									.optional()
									.describe(
										'Optional mapping of unsafe bindings names to options provided for the plugin.'
									),
								plugin: z
									.strictObject({
										name: z
											.string()
											.describe('Plugin is the name of the plugin exposed by the package.'),
										package: z
											.string()
											.describe(
												'Package is the bare specifier of the package that exposes plugins to integrate into Miniflare via a named `plugins` export.'
											),
									})
									.describe('Type: object'),
							})
							.optional()
							.describe('Type: object'),
						name: z.string().describe('The name of the binding provided to the Worker'),
						type: z.string().describe("The 'type' of the unsafe binding."),
					})
				)
				.optional()
				.describe(
					"A set of bindings that should be put into a Worker's upload metadata without changes. These can be used to implement bindings for features that haven't released and aren't supported directly by wrangler or miniflare."
				),
			capnp: z
				.union([
					z.strictObject({
						base_path: z.string().describe('Type: string'),
						source_schemas: z.array(z.string()).describe('Type: array'),
					}),
					z.strictObject({
						compiled_schema: z.string().describe('Type: string'),
					}),
				])
				.optional()
				.describe('Used for internal capnp uploads for the Workers runtime'),
			metadata: z
				.looseObject({})
				.optional()
				.describe(
					'Arbitrary key/value pairs that will be included in the uploaded metadata.  Values specified here will always be applied to metadata last, so can add new or override existing fields.'
				),
		})
		.optional()
		.describe(
			'"Unsafe" tables for features that aren\'t directly supported by wrangler.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	unsafe_hello_world: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				enable_timer: z.boolean().optional().describe('Whether the timer is enabled'),
			})
		)
		.optional()
		.describe(
			'**DO NOT USE**. Hello World Binding Config to serve as an explanatory example.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	upload_source_maps: z
		.boolean()
		.optional()
		.describe(
			'Include source maps when uploading this worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps'
		),
	vectorize: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Vectorize index in the Worker.'),
				index_name: z.string().describe('The name of the index.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Vectorize index should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Vectorize indexes that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes\n\nDefault: []'
		),
	vpc_networks: z
		.array(
			z.union([
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
					tunnel_id: z
						.string()
						.describe(
							'The tunnel ID of the Cloudflare Tunnel to route traffic through. Mutually exclusive with network_id.'
						),
				}),
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					network_id: z
						.string()
						.describe(
							'The network ID to route traffic through. Mutually exclusive with tunnel_id.'
						),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
				}),
			])
		)
		.optional()
		.describe(
			'Specifies VPC networks that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	wasm_modules: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A list of wasm modules that your worker should be bound to. This is the "legacy" way of binding to a wasm module. ES module workers should do proper module imports.'
		),
	websearch: z
		.strictObject({
			binding: z.string().describe('The binding name used to refer to Web Search in the Worker.'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Web Search binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
})

/**
 * Type: object
 */
type RawDevConfigInferred = z.infer<typeof RawDevConfig>
export interface RawDevConfig extends RawDevConfigInferred {
	/**
	 * IP address for the local dev server to listen on,
	 *
	 * @default "localhost"
	 */
	ip?: RawDevConfigInferred['ip']
	/**
	 * Port for the local dev server to listen on
	 *
	 * @default 8787
	 */
	port?: RawDevConfigInferred['port']
	/**
	 * Port for the local dev server's inspector to listen on
	 *
	 * @default 9229
	 */
	inspector_port?: RawDevConfigInferred['inspector_port']
	/**
	 * IP address for the local dev server's inspector to listen on
	 *
	 * @default "127.0.0.1"
	 */
	inspector_ip?: RawDevConfigInferred['inspector_ip']
	/**
	 * Protocol that local wrangler dev server listens to requests on.
	 *
	 * @default "http"
	 */
	local_protocol?: RawDevConfigInferred['local_protocol']
	/**
	 * Protocol that wrangler dev forwards requests on
	 *
	 * Setting this to `http` is not currently implemented for remote mode. See https://github.com/cloudflare/workers-sdk/issues/583
	 *
	 * @default "https"
	 */
	upstream_protocol?: RawDevConfigInferred['upstream_protocol']
	/**
	 * Host to forward requests to, defaults to the host of the first route of project
	 */
	host?: RawDevConfigInferred['host']
	/**
	 * When developing, whether to build and connect to containers. This requires a Docker daemon to be running. Defaults to `true`.
	 *
	 * @default true
	 */
	enable_containers?: RawDevConfigInferred['enable_containers']
	/**
	 * Either the Docker unix socket i.e. `unix:///var/run/docker.sock` or a full configuration. Note that windows is only supported via WSL at the moment
	 */
	container_engine?: RawDevConfigInferred['container_engine']
	/**
	 * Re-generate your worker types when your Wrangler configuration file changes.
	 *
	 * @default false
	 */
	generate_types?: RawDevConfigInferred['generate_types']
}
export const RawDevConfig = z.strictObject({
	container_engine: z
		.lazy(() => ContainerEngine)
		.optional()
		.describe(
			'Either the Docker unix socket i.e. `unix:///var/run/docker.sock` or a full configuration. Note that windows is only supported via WSL at the moment'
		),
	enable_containers: z
		.boolean()
		.optional()
		.describe(
			'When developing, whether to build and connect to containers. This requires a Docker daemon to be running. Defaults to `true`.\n\nDefault: true'
		),
	generate_types: z
		.boolean()
		.optional()
		.describe(
			'Re-generate your worker types when your Wrangler configuration file changes.\n\nDefault: false'
		),
	host: z
		.string()
		.optional()
		.describe('Host to forward requests to, defaults to the host of the first route of project'),
	inspector_ip: z
		.string()
		.optional()
		.describe(
			'IP address for the local dev server\'s inspector to listen on\n\nDefault: "127.0.0.1"'
		),
	inspector_port: z
		.number()
		.optional()
		.describe("Port for the local dev server's inspector to listen on\n\nDefault: 9229"),
	ip: z
		.string()
		.optional()
		.describe('IP address for the local dev server to listen on,\n\nDefault: "localhost"'),
	local_protocol: z
		.enum(['http', 'https'])
		.optional()
		.describe('Protocol that local wrangler dev server listens to requests on.\n\nDefault: "http"'),
	port: z
		.number()
		.optional()
		.describe('Port for the local dev server to listen on\n\nDefault: 8787'),
	upstream_protocol: z
		.enum(['https', 'http'])
		.optional()
		.describe(
			'Protocol that wrangler dev forwards requests on\n\nSetting this to `http` is not currently implemented for remote mode. See https://github.com/cloudflare/workers-sdk/issues/583\n\nDefault: "https"'
		),
})

/**
 * The raw environment configuration that we read from the config file.
 *
 * All the properties are optional, and will be replaced with defaults in the configuration that is used in the rest of the codebase.
 */
type RawEnvironmentInferred = z.infer<typeof RawEnvironment>
export interface RawEnvironment extends RawEnvironmentInferred {
	/**
	 * The name of your Worker. Alphanumeric + dashes only.
	 */
	name?: RawEnvironmentInferred['name']
	/**
	 * This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.
	 */
	account_id?: RawEnvironmentInferred['account_id']
	/**
	 * A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-dates
	 */
	compatibility_date?: RawEnvironmentInferred['compatibility_date']
	/**
	 * A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.
	 *
	 * More details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/
	 *
	 * @default []
	 */
	compatibility_flags?: RawEnvironmentInferred['compatibility_flags']
	/**
	 * The entrypoint/path to the JavaScript file that will be executed.
	 */
	main?: RawEnvironmentInferred['main']
	/**
	 * If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.
	 */
	find_additional_modules?: RawEnvironmentInferred['find_additional_modules']
	/**
	 * Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.
	 */
	preserve_file_names?: RawEnvironmentInferred['preserve_file_names']
	/**
	 * The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.
	 */
	base_dir?: RawEnvironmentInferred['base_dir']
	/**
	 * Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
	 *
	 * @default true
	 */
	workers_dev?: RawEnvironmentInferred['workers_dev']
	/**
	 * Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.
	 *
	 * @default false
	 */
	preview_urls?: RawEnvironmentInferred['preview_urls']
	/**
	 * A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker (see `triggers`)
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes
	 */
	routes?: RawEnvironmentInferred['routes']
	/**
	 * A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.
	 *
	 * Only required when workers_dev is false, and there's no scheduled Worker
	 */
	route?: RawEnvironmentInferred['route']
	/**
	 * Path to a custom tsconfig
	 */
	tsconfig?: RawEnvironmentInferred['tsconfig']
	/**
	 * The function to use to replace jsx syntax.
	 *
	 * @default "React.createElement"
	 */
	jsx_factory?: RawEnvironmentInferred['jsx_factory']
	/**
	 * The function to use to replace jsx fragment syntax.
	 *
	 * @default "React.Fragment"
	 */
	jsx_fragment?: RawEnvironmentInferred['jsx_fragment']
	/**
	 * A list of migrations that should be uploaded with your Worker.
	 *
	 * These define changes in your Durable Object declarations.
	 *
	 * More details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations
	 *
	 * @default []
	 */
	migrations?: RawEnvironmentInferred['migrations']
	/**
	 * Declarative exports configuration — a map of class name to export configuration.
	 *
	 * The configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.
	 *
	 * @default {}
	 */
	exports?: RawEnvironmentInferred['exports']
	/**
	 * "Cron" definitions to trigger a Worker's "scheduled" function.
	 *
	 * Lets you call Workers periodically, much like a cron job.
	 *
	 * More details here https://developers.cloudflare.com/workers/platform/cron-triggers
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers
	 *
	 * @default {"crons":[]}
	 */
	triggers?: RawEnvironmentInferred['triggers']
	/**
	 * Specify limits for runtime behavior. Only supported for the "standard" Usage Model
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits
	 */
	limits?: RawEnvironmentInferred['limits']
	/**
	 * An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling
	 */
	rules?: RawEnvironmentInferred['rules']
	/**
	 * Configures a custom build step to be run by Wrangler when building your Worker.
	 *
	 * Refer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds
	 *
	 * @default {"watch_dir":"./src"}
	 */
	build?: RawEnvironmentInferred['build']
	/**
	 * Skip internal build steps and directly deploy script
	 */
	no_bundle?: RawEnvironmentInferred['no_bundle']
	/**
	 * Minify the script before uploading.
	 */
	minify?: RawEnvironmentInferred['minify']
	/**
	 * Set the `name` property to the original name for functions and classes renamed during minification.
	 *
	 * See https://esbuild.github.io/api/#keep-names
	 *
	 * @default true
	 */
	keep_names?: RawEnvironmentInferred['keep_names']
	/**
	 * Designates this Worker as an internal-only "first-party" Worker.
	 */
	first_party_worker?: RawEnvironmentInferred['first_party_worker']
	/**
	 * List of bindings that you will send to logfwdr
	 *
	 * @default {"bindings":[]}
	 */
	logfwdr?: RawEnvironmentInferred['logfwdr']
	/**
	 * Send Trace Events from this Worker to Workers Logpush.
	 *
	 * This will not configure a corresponding Logpush job automatically.
	 *
	 * For more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/
	 */
	logpush?: RawEnvironmentInferred['logpush']
	/**
	 * Include source maps when uploading this worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps
	 */
	upload_source_maps?: RawEnvironmentInferred['upload_source_maps']
	/**
	 * Specify how the Worker should be located to minimize round-trip time.
	 *
	 * More details: https://developers.cloudflare.com/workers/platform/smart-placement/
	 */
	placement?: RawEnvironmentInferred['placement']
	/**
	 * Specify the directory of static assets to deploy/serve
	 *
	 * More details at https://developers.cloudflare.com/workers/frameworks/
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets
	 */
	assets?: RawEnvironmentInferred['assets']
	/**
	 * Specify the observability behavior of the Worker.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability
	 */
	observability?: RawEnvironmentInferred['observability']
	/**
	 * Specify the cache behavior of the Worker.
	 */
	cache?: RawEnvironmentInferred['cache']
	/**
	 * Specify the compliance region mode of the Worker.
	 *
	 * Although if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.
	 */
	compliance_region?: RawEnvironmentInferred['compliance_region']
	/**
	 * Configuration for Python modules.
	 */
	python_modules?: RawEnvironmentInferred['python_modules']
	/**
	 * Configuration for Worker Previews.
	 *
	 * Previews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews
	 */
	previews?: RawEnvironmentInferred['previews']
	/**
	 * A map of values to substitute when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	define?: RawEnvironmentInferred['define']
	/**
	 * A map of environment variables to set when deploying your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
	 *
	 * @default {}
	 */
	vars?: RawEnvironmentInferred['vars']
	/**
	 * Secrets configuration.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property
	 */
	secrets?: RawEnvironmentInferred['secrets']
	/**
	 * A list of durable objects that your Worker should be bound to.
	 *
	 * For more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects
	 *
	 * @default {"bindings":[]}
	 */
	durable_objects?: RawEnvironmentInferred['durable_objects']
	/**
	 * A list of workflows that your Worker should be bound to.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	workflows?: RawEnvironmentInferred['workflows']
	/**
	 * Cloudchamber configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	cloudchamber?: RawEnvironmentInferred['cloudchamber']
	/**
	 * Container related configuration
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	containers?: RawEnvironmentInferred['containers']
	/**
	 * These specify any Workers KV Namespaces you want to access from inside your Worker.
	 *
	 * To learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces
	 *
	 * @default []
	 */
	kv_namespaces?: RawEnvironmentInferred['kv_namespaces']
	/**
	 * These specify bindings to send email from inside your Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings
	 *
	 * @default []
	 */
	send_email?: RawEnvironmentInferred['send_email']
	/**
	 * Specifies Queues that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues
	 *
	 * @default {"consumers":[],"producers":[]}
	 */
	queues?: RawEnvironmentInferred['queues']
	/**
	 * Specifies R2 buckets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets
	 *
	 * @default []
	 */
	r2_buckets?: RawEnvironmentInferred['r2_buckets']
	/**
	 * Specifies D1 databases that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases
	 *
	 * @default []
	 */
	d1_databases?: RawEnvironmentInferred['d1_databases']
	/**
	 * Specifies Vectorize indexes that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes
	 *
	 * @default []
	 */
	vectorize?: RawEnvironmentInferred['vectorize']
	/**
	 * Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search_namespaces?: RawEnvironmentInferred['ai_search_namespaces']
	/**
	 * Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ai_search?: RawEnvironmentInferred['ai_search']
	/**
	 * Specifies Agent Memory namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	agent_memory?: RawEnvironmentInferred['agent_memory']
	/**
	 * Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	websearch?: RawEnvironmentInferred['websearch']
	/**
	 * Specifies Hyperdrive configs that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive
	 *
	 * @default []
	 */
	hyperdrive?: RawEnvironmentInferred['hyperdrive']
	/**
	 * Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings
	 *
	 * @default []
	 */
	services?: RawEnvironmentInferred['services']
	/**
	 * Specifies analytics engine datasets that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets
	 *
	 * @default []
	 */
	analytics_engine_datasets?: RawEnvironmentInferred['analytics_engine_datasets']
	/**
	 * A browser that will be usable from the Worker.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering
	 */
	browser?: RawEnvironmentInferred['browser']
	/**
	 * Binding to the AI project.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai
	 */
	ai?: RawEnvironmentInferred['ai']
	/**
	 * Binding to Cloudflare Images
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images
	 */
	images?: RawEnvironmentInferred['images']
	/**
	 * Binding to Cloudflare Media Transformations
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	media?: RawEnvironmentInferred['media']
	/**
	 * Binding to Cloudflare Stream
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 */
	stream?: RawEnvironmentInferred['stream']
	/**
	 * Binding to the Worker Version's metadata
	 */
	version_metadata?: RawEnvironmentInferred['version_metadata']
	/**
	 * "Unsafe" tables for features that aren't directly supported by wrangler.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default {}
	 */
	unsafe?: RawEnvironmentInferred['unsafe']
	/**
	 * Specifies a list of mTLS certificates that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates
	 *
	 * @default []
	 */
	mtls_certificates?: RawEnvironmentInferred['mtls_certificates']
	/**
	 * Specifies a list of Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	tail_consumers?: RawEnvironmentInferred['tail_consumers']
	/**
	 * Specifies a list of Streaming Tail Workers that are bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	streaming_tail_consumers?: RawEnvironmentInferred['streaming_tail_consumers']
	/**
	 * Specifies namespace bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * For reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms
	 *
	 * @default []
	 */
	dispatch_namespaces?: RawEnvironmentInferred['dispatch_namespaces']
	/**
	 * Specifies list of Pipelines bound to this Worker environment
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	pipelines?: RawEnvironmentInferred['pipelines']
	/**
	 * Specifies Secret Store bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	secrets_store_secrets?: RawEnvironmentInferred['secrets_store_secrets']
	/**
	 * Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	artifacts?: RawEnvironmentInferred['artifacts']
	/**
	 * **DO NOT USE**. Hello World Binding Config to serve as an explanatory example.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	unsafe_hello_world?: RawEnvironmentInferred['unsafe_hello_world']
	/**
	 * Specifies Flagship feature flag bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	flagship?: RawEnvironmentInferred['flagship']
	/**
	 * Specifies rate limit bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	ratelimits?: RawEnvironmentInferred['ratelimits']
	/**
	 * Specifies Worker Loader bindings that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	worker_loaders?: RawEnvironmentInferred['worker_loaders']
	/**
	 * Specifies VPC services that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_services?: RawEnvironmentInferred['vpc_services']
	/**
	 * Specifies VPC networks that are bound to this Worker environment.
	 *
	 * NOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.
	 *
	 * @default []
	 */
	vpc_networks?: RawEnvironmentInferred['vpc_networks']
}
export const RawEnvironment = z.strictObject({
	account_id: z
		.string()
		.optional()
		.describe(
			'This is the ID of the account associated with your zone. You might have more than one account, so make sure to use the ID of the account associated with the zone/route you provide, if you provide one. It can also be specified through the CLOUDFLARE_ACCOUNT_ID environment variable.'
		),
	agent_memory: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Agent Memory namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Agent Memory binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Agent Memory namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the AI binding should be remote or not in local development'),
			staging: z.boolean().optional().describe('Type: boolean'),
		})
		.optional()
		.describe(
			'Binding to the AI project.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai'
		),
	ai_search: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search instance in the Worker.'),
				instance_name: z
					.string()
					.describe('The user-chosen instance name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the AI Search instance binding should be remote in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search instance bindings that are bound to this Worker environment. Each binding is bound directly to a single pre-existing instance within the "default" namespace.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	ai_search_namespaces: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the AI Search namespace in the Worker.'),
				namespace: z
					.string()
					.describe('The user-chosen namespace name. Must exist in Cloudflare at deploy time.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Whether the AI Search namespace binding should be remote in local development'
					),
			})
		)
		.optional()
		.describe(
			'Specifies AI Search namespace bindings that are bound to this Worker environment. Each binding is scoped to a namespace and allows dynamic instance CRUD within it.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	analytics_engine_datasets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the dataset in the Worker.'),
				dataset: z.string().optional().describe('The name of this dataset to write to.'),
			})
		)
		.optional()
		.describe(
			'Specifies analytics engine datasets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#analytics-engine-datasets\n\nDefault: []'
		),
	artifacts: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the Artifacts instance.'),
				namespace: z.string().describe('The namespace to use.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether to use the remote Artifacts service in local dev.'),
			})
		)
		.optional()
		.describe(
			'Specifies Artifacts bindings that are bound to this Worker environment. Artifacts provides git-compatible file storage on Cloudflare Workers.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	assets: z
		.lazy(() => Assets)
		.optional()
		.describe(
			'Specify the directory of static assets to deploy/serve\n\nMore details at https://developers.cloudflare.com/workers/frameworks/\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#assets'
		),
	base_dir: z
		.string()
		.optional()
		.describe(
			'The directory in which module rules should be evaluated when including additional files into a Worker deployment. This defaults to the directory containing the `main` entry point of the Worker if not specified.'
		),
	browser: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Browser binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'A browser that will be usable from the Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#browser-rendering'
		),
	build: z
		.strictObject({
			command: z
				.string()
				.optional()
				.describe(
					'The command used to build your Worker. On Linux and macOS, the command is executed in the `sh` shell and the `cmd` shell for Windows. The `&&` and `||` shell operators may be used.'
				),
			cwd: z.string().optional().describe('The directory in which the command is executed.'),
			watch_dir: z
				.union([z.string(), z.array(z.string())])
				.optional()
				.describe(
					'The directory to watch for changes while using wrangler dev, defaults to the current working directory'
				),
		})
		.optional()
		.describe(
			'Configures a custom build step to be run by Wrangler when building your Worker.\n\nRefer to the [custom builds documentation](https://developers.cloudflare.com/workers/cli-wrangler/configuration#build) for more details.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds\n\nDefault: {"watch_dir":"./src"}'
		),
	cache: z
		.lazy(() => CacheOptions)
		.optional()
		.describe('Specify the cache behavior of the Worker.'),
	cloudchamber: z
		.lazy(() => CloudchamberConfig)
		.optional()
		.describe(
			'Cloudchamber configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	compatibility_date: z
		.string()
		.optional()
		.describe(
			'A date in the form yyyy-mm-dd, which will be used to determine which version of the Workers runtime is used.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-dates'
		),
	compatibility_flags: z
		.array(z.string())
		.optional()
		.describe(
			'A list of flags that enable features from upcoming features of the Workers runtime, usually used together with compatibility_date.\n\nMore details at https://developers.cloudflare.com/workers/configuration/compatibility-flags/\n\nDefault: []'
		),
	compliance_region: z
		.enum(['public', 'fedramp_high'])
		.optional()
		.describe(
			'Specify the compliance region mode of the Worker.\n\nAlthough if the user does not specify a compliance region, the default is `public`, it can be set to `undefined` in configuration to delegate to the CLOUDFLARE_COMPLIANCE_REGION environment variable.'
		),
	containers: z
		.array(z.lazy(() => ContainerApp))
		.optional()
		.describe(
			'Container related configuration\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	d1_databases: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the D1 database in the Worker.'),
				database_id: z.string().optional().describe('The UUID of this D1 database (not required).'),
				database_internal_env: z.string().optional().describe('Internal use only.'),
				database_name: z.string().optional().describe('The name of this D1 database.'),
				migrations_dir: z
					.string()
					.optional()
					.describe(
						"The path to the directory of migrations for this D1 database (defaults to './migrations')."
					),
				migrations_pattern: z
					.string()
					.optional()
					.describe(
						"A glob pattern (relative to the Wrangler config file) used to discover migration files for this D1 database. Defaults to `${migrations_dir}/*.sql` if not specified.\n\nUse this to opt in to nested layouts such as `migrations/*\\/migration.sql` (as produced by some ORMs).\n\nWhen `migrations_pattern` is set, `migrations_dir` must also be set, and `migrations_pattern` must start with `${migrations_dir}/`. This keeps the relationship between the two settings explicit and lets Wrangler record each migration's name in the migrations table as a path relative to `migrations_dir`."
					),
				migrations_table: z
					.string()
					.optional()
					.describe(
						"The name of the migrations table for this D1 database (defaults to 'd1_migrations')."
					),
				preview_database_id: z
					.string()
					.optional()
					.describe('The UUID of this D1 database for Wrangler Dev (if specified).'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the D1 database should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies D1 databases that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases\n\nDefault: []'
		),
	define: z
		.looseObject({})
		.catchall(z.string())
		.optional()
		.describe(
			'A map of values to substitute when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	dispatch_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				namespace: z.string().describe('The namespace to bind to.'),
				outbound: z
					.lazy(() => DispatchNamespaceOutbound)
					.optional()
					.describe(
						'Details about the outbound Worker which will handle outbound requests from your namespace'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Dispatch Namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies namespace bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms\n\nDefault: []'
		),
	durable_objects: z
		.strictObject({
			bindings: z.lazy(() => DurableObjectBindings),
		})
		.optional()
		.describe(
			'A list of durable objects that your Worker should be bound to.\n\nFor more information about Durable Objects, see the documentation at https://developers.cloudflare.com/workers/learning/using-durable-objects\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects\n\nDefault: {"bindings":[]}'
		),
	exports: z
		.lazy(() => Exports)
		.optional()
		.describe(
			'Declarative exports configuration — a map of class name to export configuration.\n\nThe configuration of Durable Objects via `exports` is mutually exclusive with `migrations`.\n\nDefault: {}'
		),
	find_additional_modules: z
		.boolean()
		.optional()
		.describe(
			'If true then Wrangler will traverse the file tree below `base_dir`; Any files that match `rules` will be included in the deployed Worker. Defaults to true if `no_bundle` is true, otherwise false.'
		),
	first_party_worker: z
		.boolean()
		.optional()
		.describe('Designates this Worker as an internal-only "first-party" Worker.'),
	flagship: z
		.array(
			z.strictObject({
				app_id: z.string().describe('The Flagship app ID to bind to.'),
				binding: z
					.string()
					.describe('The binding name used to refer to the bound Flagship service.'),
				remote: z
					.boolean()
					.optional()
					.describe(
						'Set to `true` to suppress the remote binding warning in local dev. Flagship bindings are always remote.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies Flagship feature flag bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	hyperdrive: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the project in the Worker.'),
				id: z.string().describe('The id of the database.'),
				localConnectionString: z
					.string()
					.optional()
					.describe('The local database connection string for `wrangler dev`'),
			})
		)
		.optional()
		.describe(
			'Specifies Hyperdrive configs that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive\n\nDefault: []'
		),
	images: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Images binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Images\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#images'
		),
	jsx_factory: z
		.string()
		.optional()
		.describe('The function to use to replace jsx syntax.\n\nDefault: "React.createElement"'),
	jsx_fragment: z
		.string()
		.optional()
		.describe('The function to use to replace jsx fragment syntax.\n\nDefault: "React.Fragment"'),
	keep_names: z
		.boolean()
		.optional()
		.describe(
			'Set the `name` property to the original name for functions and classes renamed during minification.\n\nSee https://esbuild.github.io/api/#keep-names\n\nDefault: true'
		),
	kv_namespaces: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the KV Namespace'),
				id: z.string().optional().describe('The ID of the KV namespace'),
				preview_id: z
					.string()
					.optional()
					.describe('The ID of the KV namespace used during `wrangler dev`'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the KV namespace should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify any Workers KV Namespaces you want to access from inside your Worker.\n\nTo learn more about KV Namespaces, see the documentation at https://developers.cloudflare.com/workers/learning/how-kv-works\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces\n\nDefault: []'
		),
	limits: z
		.lazy(() => UserLimits)
		.optional()
		.describe(
			'Specify limits for runtime behavior. Only supported for the "standard" Usage Model\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#limits'
		),
	logfwdr: z
		.strictObject({
			bindings: z
				.array(
					z.strictObject({
						destination: z.string().describe('The destination for this logged message'),
						name: z.string().describe('The binding name used to refer to logfwdr'),
					})
				)
				.describe('Type: array'),
		})
		.optional()
		.describe('List of bindings that you will send to logfwdr\n\nDefault: {"bindings":[]}'),
	logpush: z
		.boolean()
		.optional()
		.describe(
			'Send Trace Events from this Worker to Workers Logpush.\n\nThis will not configure a corresponding Logpush job automatically.\n\nFor more information about Workers Logpush, see: https://blog.cloudflare.com/logpush-for-workers/'
		),
	main: z
		.string()
		.optional()
		.describe('The entrypoint/path to the JavaScript file that will be executed.'),
	media: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z.boolean().optional().describe('Whether the Media binding should be remote or not'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Media Transformations\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	migrations: z
		.array(z.lazy(() => DurableObjectMigration))
		.optional()
		.describe(
			'A list of migrations that should be uploaded with your Worker.\n\nThese define changes in your Durable Object declarations.\n\nMore details at https://developers.cloudflare.com/workers/learning/using-durable-objects#configuring-durable-object-classes-with-migrations\n\nDefault: []'
		),
	minify: z.boolean().optional().describe('Minify the script before uploading.'),
	mtls_certificates: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the certificate in the Worker'),
				certificate_id: z.string().describe('The uuid of the uploaded mTLS certificate'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the mtls fetcher should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies a list of mTLS certificates that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#mtls-certificates\n\nDefault: []'
		),
	name: z.string().optional().describe('The name of your Worker. Alphanumeric + dashes only.'),
	no_bundle: z
		.boolean()
		.optional()
		.describe('Skip internal build steps and directly deploy script'),
	observability: z
		.lazy(() => Observability)
		.optional()
		.describe(
			'Specify the observability behavior of the Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#observability'
		),
	pipelines: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				pipeline: z.string().optional().describe('Id of the Stream to bind'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the pipeline should be remote or not in local development'),
				stream: z.string().optional().describe('Id of the Stream to bind'),
			})
		)
		.optional()
		.describe(
			'Specifies list of Pipelines bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	placement: z
		.union([
			z.strictObject({
				hint: z.string().optional().describe('Type: string'),
				mode: z.enum(['off', 'smart']).describe('Allowed values: "off", "smart"'),
			}),
			z.strictObject({
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
				region: z.string().describe('Type: string'),
			}),
			z.strictObject({
				host: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
			z.strictObject({
				hostname: z.string().describe('Type: string'),
				mode: z.literal('targeted').optional().describe('Allowed value: "targeted"'),
			}),
		])
		.optional()
		.describe(
			'Specify how the Worker should be located to minimize round-trip time.\n\nMore details: https://developers.cloudflare.com/workers/platform/smart-placement/'
		),
	preserve_file_names: z
		.boolean()
		.optional()
		.describe(
			'Determines whether Wrangler will preserve bundled file names. Defaults to false. If left unset, files will be named using the pattern ${fileHash}-${basename}, for example, `34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`.'
		),
	preview_urls: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <version>-<name>.<subdomain>.workers.dev to serve Preview URLs for your Worker.\n\nDefault: false'
		),
	previews: z
		.lazy(() => PreviewsConfig)
		.optional()
		.describe(
			"Configuration for Worker Previews.\n\nPreviews are branches of your Worker's main instance used to test features in development outside of production. This block defines the settings used when creating Preview deployments via `wrangler preview`.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#previews"
		),
	python_modules: z
		.strictObject({
			exclude: z
				.array(z.string())
				.describe(
					'A list of glob patterns to exclude files from the python_modules directory when bundling.\n\nPatterns are relative to the python_modules directory and use glob syntax.\n\nDefault: ["***.pyc"]'
				),
		})
		.optional()
		.describe('Configuration for Python modules.'),
	queues: z
		.strictObject({
			consumers: z
				.array(
					z.strictObject({
						queue: z
							.string()
							.describe('The name of the queue from which this consumer should consume.'),
						max_batch_size: z
							.number()
							.optional()
							.describe('The maximum number of messages per batch'),
						max_batch_timeout: z
							.number()
							.optional()
							.describe('The maximum number of seconds to wait to fill a batch with messages.'),
						max_concurrency: z
							.number()
							.nullable()
							.optional()
							.describe(
								'The maximum number of concurrent consumer Worker invocations. Leaving this unset will allow your consumer to scale to the maximum concurrency needed to keep up with the message backlog.'
							),
						max_retries: z
							.number()
							.optional()
							.describe('The maximum number of retries for each message.'),
						dead_letter_queue: z
							.string()
							.optional()
							.describe('The queue to send messages that failed to be consumed.'),
						retry_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before retrying a message'),
						type: z
							.literal('worker')
							.optional()
							.describe(
								'The consumer type. Only "worker" is supported in wrangler config. Default is "worker".'
							),
						visibility_timeout_ms: z
							.number()
							.optional()
							.describe(
								'The number of milliseconds to wait for pulled messages to become visible again'
							),
					})
				)
				.optional()
				.describe('Consumer configuration'),
			producers: z
				.array(
					z.strictObject({
						binding: z
							.string()
							.describe('The binding name used to refer to the Queue in the Worker.'),
						delivery_delay: z
							.number()
							.optional()
							.describe('The number of seconds to wait before delivering a message'),
						queue: z.string().describe('The name of this Queue.'),
						remote: z
							.boolean()
							.optional()
							.describe('Whether the Queue producer should be remote or not in local development'),
					})
				)
				.optional()
				.describe('Producer bindings'),
		})
		.optional()
		.describe(
			'Specifies Queues that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#queues\n\nDefault: {"consumers":[],"producers":[]}'
		),
	r2_buckets: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the R2 bucket in the Worker.'),
				bucket_name: z.string().optional().describe('The name of this R2 bucket at the edge.'),
				jurisdiction: z
					.string()
					.optional()
					.describe('The jurisdiction that the bucket exists in. Default if not present.'),
				preview_bucket_name: z
					.string()
					.optional()
					.describe('The preview name of this R2 bucket at the edge.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the R2 bucket should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies R2 buckets that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets\n\nDefault: []'
		),
	ratelimits: z
		.array(
			z.strictObject({
				name: z
					.string()
					.describe('The binding name used to refer to the rate limiter in the Worker.'),
				namespace_id: z.string().describe('The namespace ID for this rate limiter.'),
				simple: z
					.strictObject({
						limit: z
							.number()
							.describe('The maximum number of requests allowed in the time period.'),
						period: z
							.union([z.literal(10), z.literal(60)])
							.describe('The time period in seconds (10 for ten seconds, 60 for one minute).'),
					})
					.describe('Simple rate limiting configuration.'),
			})
		)
		.optional()
		.describe(
			'Specifies rate limit bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	route: z
		.lazy(() => Route)
		.optional()
		.describe(
			"A route that your Worker should be published to. Literally the same as routes, but only one. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker"
		),
	routes: z
		.array(z.lazy(() => Route))
		.optional()
		.describe(
			"A list of routes that your Worker should be published to. Only one of `routes` or `route` is required.\n\nOnly required when workers_dev is false, and there's no scheduled Worker (see `triggers`)\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes"
		),
	rules: z
		.array(z.lazy(() => Rule))
		.optional()
		.describe(
			'An ordered list of rules that define which modules to import, and what type to import them as. You will need to specify rules to use Text, Data, and CompiledWasm modules, or when you wish to have a .js file be treated as an ESModule instead of CommonJS.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#bundling'
		),
	secrets: z
		.strictObject({
			required: z
				.array(z.string())
				.optional()
				.describe(
					'List of secret names that are required by your Worker. When defined, this property:\n- Replaces .dev.vars/.env/process.env inference for type generation\n- Enables local dev validation with warnings for missing secrets'
				),
		})
		.optional()
		.describe(
			'Secrets configuration.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#secrets-configuration-property'
		),
	secrets_store_secrets: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				secret_name: z.string().describe('Name of the secret'),
				store_id: z.string().describe('Id of the secret store'),
			})
		)
		.optional()
		.describe(
			'Specifies Secret Store bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	send_email: z
		.array(
			z.strictObject({
				allowed_destination_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of verified addresses'),
				allowed_sender_addresses: z
					.array(z.string())
					.optional()
					.describe('If this binding should be restricted to a set of sender addresses'),
				destination_address: z
					.string()
					.optional()
					.describe('If this binding should be restricted to a specific verified address'),
				name: z.string().describe('The binding name used to refer to the this binding'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the binding should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'These specify bindings to send email from inside your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings\n\nDefault: []'
		),
	services: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				entrypoint: z
					.string()
					.optional()
					.describe('Optionally, the entrypoint (named export) of the service to bind to.'),
				props: z
					.looseObject({})
					.optional()
					.describe(
						'Optional properties that will be made available to the service via ctx.props.'
					),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the service binding should be remote or not in local development'),
				service: z
					.string()
					.describe(
						'The name of the service. To bind to a worker in a specific environment, you should use the format `<worker_name>-<environment_name>`.'
					),
			})
		)
		.optional()
		.describe(
			'Specifies service bindings (Worker-to-Worker) that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings\n\nDefault: []'
		),
	stream: z
		.strictObject({
			binding: z.string().describe('Type: string'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Stream binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Binding to Cloudflare Stream\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	streaming_tail_consumers: z
		.array(z.lazy(() => StreamingTailConsumer))
		.optional()
		.describe(
			'Specifies a list of Streaming Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	tail_consumers: z
		.array(z.lazy(() => TailConsumer))
		.optional()
		.describe(
			'Specifies a list of Tail Workers that are bound to this Worker environment\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	triggers: z
		.strictObject({
			crons: z.array(z.string()).optional().describe('Type: array'),
		})
		.optional()
		.describe(
			'"Cron" definitions to trigger a Worker\'s "scheduled" function.\n\nLets you call Workers periodically, much like a cron job.\n\nMore details here https://developers.cloudflare.com/workers/platform/cron-triggers\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers\n\nDefault: {"crons":[]}'
		),
	tsconfig: z.string().optional().describe('Path to a custom tsconfig'),
	unsafe: z
		.strictObject({
			bindings: z
				.array(
					z.looseObject({
						dev: z
							.strictObject({
								options: z
									.looseObject({})
									.optional()
									.describe(
										'Optional mapping of unsafe bindings names to options provided for the plugin.'
									),
								plugin: z
									.strictObject({
										name: z
											.string()
											.describe('Plugin is the name of the plugin exposed by the package.'),
										package: z
											.string()
											.describe(
												'Package is the bare specifier of the package that exposes plugins to integrate into Miniflare via a named `plugins` export.'
											),
									})
									.describe('Type: object'),
							})
							.optional()
							.describe('Type: object'),
						name: z.string().describe('The name of the binding provided to the Worker'),
						type: z.string().describe("The 'type' of the unsafe binding."),
					})
				)
				.optional()
				.describe(
					"A set of bindings that should be put into a Worker's upload metadata without changes. These can be used to implement bindings for features that haven't released and aren't supported directly by wrangler or miniflare."
				),
			capnp: z
				.union([
					z.strictObject({
						base_path: z.string().describe('Type: string'),
						source_schemas: z.array(z.string()).describe('Type: array'),
					}),
					z.strictObject({
						compiled_schema: z.string().describe('Type: string'),
					}),
				])
				.optional()
				.describe('Used for internal capnp uploads for the Workers runtime'),
			metadata: z
				.looseObject({})
				.optional()
				.describe(
					'Arbitrary key/value pairs that will be included in the uploaded metadata.  Values specified here will always be applied to metadata last, so can add new or override existing fields.'
				),
		})
		.optional()
		.describe(
			'"Unsafe" tables for features that aren\'t directly supported by wrangler.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: {}'
		),
	unsafe_hello_world: z
		.array(
			z.strictObject({
				binding: z.string().describe('The binding name used to refer to the bound service.'),
				enable_timer: z.boolean().optional().describe('Whether the timer is enabled'),
			})
		)
		.optional()
		.describe(
			'**DO NOT USE**. Hello World Binding Config to serve as an explanatory example.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	upload_source_maps: z
		.boolean()
		.optional()
		.describe(
			'Include source maps when uploading this worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#source-maps'
		),
	vars: z
		.looseObject({})
		.catchall(z.union([z.string(), z.lazy(() => Json)]))
		.optional()
		.describe(
			'A map of environment variables to set when deploying your Worker.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables\n\nDefault: {}'
		),
	vectorize: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Vectorize index in the Worker.'),
				index_name: z.string().describe('The name of the index.'),
				remote: z
					.boolean()
					.optional()
					.describe('Whether the Vectorize index should be remote or not in local development'),
			})
		)
		.optional()
		.describe(
			'Specifies Vectorize indexes that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes\n\nDefault: []'
		),
	version_metadata: z
		.strictObject({
			binding: z.string().describe('Type: string'),
		})
		.optional()
		.describe("Binding to the Worker Version's metadata"),
	vpc_networks: z
		.array(
			z.union([
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
					tunnel_id: z
						.string()
						.describe(
							'The tunnel ID of the Cloudflare Tunnel to route traffic through. Mutually exclusive with network_id.'
						),
				}),
				z.strictObject({
					binding: z
						.string()
						.describe('The binding name used to refer to the VPC network in the Worker.'),
					network_id: z
						.string()
						.describe(
							'The network ID to route traffic through. Mutually exclusive with tunnel_id.'
						),
					remote: z.boolean().optional().describe('Whether the VPC network is remote or not'),
				}),
			])
		)
		.optional()
		.describe(
			'Specifies VPC networks that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	vpc_services: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the VPC service in the Worker.'),
				remote: z.boolean().optional().describe('Whether the VPC service is remote or not'),
				service_id: z.string().describe('The service ID of the VPC connectivity service.'),
			})
		)
		.optional()
		.describe(
			'Specifies VPC services that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	websearch: z
		.strictObject({
			binding: z.string().describe('The binding name used to refer to Web Search in the Worker.'),
			remote: z
				.boolean()
				.optional()
				.describe('Whether the Web Search binding should be remote or not in local development'),
		})
		.optional()
		.describe(
			'Cloudflare Web Search binding. There is exactly one shared web corpus, so the binding is zero-config -- only the variable name is required, declared as a single object (not an array).\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.'
		),
	worker_loaders: z
		.array(
			z.strictObject({
				binding: z
					.string()
					.describe('The binding name used to refer to the Worker Loader in the Worker.'),
			})
		)
		.optional()
		.describe(
			'Specifies Worker Loader bindings that are bound to this Worker environment.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
	workers_dev: z
		.boolean()
		.optional()
		.describe(
			'Whether we use <name>.<subdomain>.workers.dev to test and deploy your Worker.\n\nFor reference, see https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev\n\nDefault: true'
		),
	workflows: z
		.array(z.lazy(() => WorkflowBinding))
		.optional()
		.describe(
			'A list of workflows that your Worker should be bound to.\n\nNOTE: This field is not automatically inherited from the top level environment, and so must be specified in every named environment.\n\nDefault: []'
		),
})

export type Route = z.infer<typeof Route>
export const Route = z.union([
	z.string(),
	z.lazy(() => ZoneIdRoute),
	z.lazy(() => ZoneNameRoute),
	z.lazy(() => CustomDomainRoute),
])

/**
 * A bundling resolver rule, defining the modules type for paths that match the specified globs.
 */
type RuleInferred = z.infer<typeof Rule>
export interface Rule extends RuleInferred {
	type: RuleInferred['type']
	/**
	 * Type: array
	 */
	globs: RuleInferred['globs']
	/**
	 * Type: boolean
	 */
	fallthrough?: RuleInferred['fallthrough']
}
export const Rule = z.strictObject({
	fallthrough: z.boolean().optional().describe('Type: boolean'),
	globs: z.array(z.string()).describe('Type: array'),
	type: z.lazy(() => ConfigModuleRuleType),
})

/**
 * Type: object
 */
type StreamingTailConsumerInferred = z.infer<typeof StreamingTailConsumer>
export interface StreamingTailConsumer extends StreamingTailConsumerInferred {
	/**
	 * The name of the service streaming tail events will be forwarded to.
	 */
	service: StreamingTailConsumerInferred['service']
}
export const StreamingTailConsumer = z.strictObject({
	service: z
		.string()
		.describe('The name of the service streaming tail events will be forwarded to.'),
})

/**
 * Type: object
 */
type TailConsumerInferred = z.infer<typeof TailConsumer>
export interface TailConsumer extends TailConsumerInferred {
	/**
	 * The name of the service tail events will be forwarded to.
	 */
	service: TailConsumerInferred['service']
	/**
	 * (Optional) The environment of the service.
	 */
	environment?: TailConsumerInferred['environment']
}
export const TailConsumer = z.strictObject({
	environment: z.string().optional().describe('(Optional) The environment of the service.'),
	service: z.string().describe('The name of the service tail events will be forwarded to.'),
})

/**
 * Type: object
 */
type UserLimitsInferred = z.infer<typeof UserLimits>
export interface UserLimits extends UserLimitsInferred {
	/**
	 * Maximum allowed CPU time for a Worker's invocation in milliseconds
	 */
	cpu_ms?: UserLimitsInferred['cpu_ms']
	/**
	 * Maximum allowed number of fetch requests that a Worker's invocation can execute
	 */
	subrequests?: UserLimitsInferred['subrequests']
}
export const UserLimits = z.strictObject({
	cpu_ms: z
		.number()
		.optional()
		.describe("Maximum allowed CPU time for a Worker's invocation in milliseconds"),
	subrequests: z
		.number()
		.optional()
		.describe("Maximum allowed number of fetch requests that a Worker's invocation can execute"),
})

/**
 * Type: object
 */
type WorkerEntrypointExportInferred = z.infer<typeof WorkerEntrypointExport>
export interface WorkerEntrypointExport extends WorkerEntrypointExportInferred {
	/**
	 * Allowed value: "worker"
	 */
	type: WorkerEntrypointExportInferred['type']
	/**
	 * Type: object
	 */
	cache?: WorkerEntrypointExportInferred['cache']
}
export const WorkerEntrypointExport = z.strictObject({
	cache: z
		.strictObject({
			enabled: z.boolean().describe('Whether cache is enabled for this entrypoint.'),
		})
		.optional()
		.describe('Type: object'),
	type: z.literal('worker').describe('Allowed value: "worker"'),
})

/**
 * Type: object
 */
type WorkflowBindingInferred = z.infer<typeof WorkflowBinding>
export interface WorkflowBinding extends WorkflowBindingInferred {
	/**
	 * The name of the binding used to refer to the Workflow
	 */
	binding: WorkflowBindingInferred['binding']
	/**
	 * The name of the Workflow
	 */
	name: WorkflowBindingInferred['name']
	/**
	 * The exported class name of the Workflow
	 */
	class_name: WorkflowBindingInferred['class_name']
	/**
	 * The script where the Workflow is defined (if it's external to this Worker)
	 */
	script_name?: WorkflowBindingInferred['script_name']
	/**
	 * Whether the Workflow should be remote or not in local development
	 */
	remote?: WorkflowBindingInferred['remote']
	/**
	 * Optional limits for the Workflow
	 */
	limits?: WorkflowBindingInferred['limits']
	/**
	 * Optional cron schedule(s) for automatically triggering workflow instances
	 */
	schedules?: WorkflowBindingInferred['schedules']
}
export const WorkflowBinding = z.strictObject({
	binding: z.string().describe('The name of the binding used to refer to the Workflow'),
	class_name: z.string().describe('The exported class name of the Workflow'),
	limits: z
		.strictObject({
			steps: z
				.number()
				.optional()
				.describe('Maximum number of steps a Workflow instance can execute'),
		})
		.optional()
		.describe('Optional limits for the Workflow'),
	name: z.string().describe('The name of the Workflow'),
	remote: z
		.boolean()
		.optional()
		.describe('Whether the Workflow should be remote or not in local development'),
	schedules: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('Optional cron schedule(s) for automatically triggering workflow instances'),
	script_name: z
		.string()
		.optional()
		.describe("The script where the Workflow is defined (if it's external to this Worker)"),
})

/**
 * Type: object
 */
type ZoneIdRouteInferred = z.infer<typeof ZoneIdRoute>
export interface ZoneIdRoute extends ZoneIdRouteInferred {
	/**
	 * Type: string
	 */
	pattern: ZoneIdRouteInferred['pattern']
	/**
	 * Type: string
	 */
	zone_id: ZoneIdRouteInferred['zone_id']
	/**
	 * Type: boolean
	 */
	custom_domain?: ZoneIdRouteInferred['custom_domain']
}
export const ZoneIdRoute = z.strictObject({
	custom_domain: z.boolean().optional().describe('Type: boolean'),
	pattern: z.string().describe('Type: string'),
	zone_id: z.string().describe('Type: string'),
})

/**
 * Type: object
 */
type ZoneNameRouteInferred = z.infer<typeof ZoneNameRoute>
export interface ZoneNameRoute extends ZoneNameRouteInferred {
	/**
	 * Type: string
	 */
	pattern: ZoneNameRouteInferred['pattern']
	/**
	 * Type: string
	 */
	zone_name: ZoneNameRouteInferred['zone_name']
	/**
	 * Type: boolean
	 */
	custom_domain?: ZoneNameRouteInferred['custom_domain']
}
export const ZoneNameRoute = z.strictObject({
	custom_domain: z.boolean().optional().describe('Type: boolean'),
	pattern: z.string().describe('Type: string'),
	zone_name: z.string().describe('Type: string'),
})
