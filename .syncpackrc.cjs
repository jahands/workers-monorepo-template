// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
	indent: '\t',
	lintFormatting: false, // handled by prettier
	// dependencyTypes: ['prod'], // disabled filter to enable all types
	versionGroups: [
		{
			label: 'local packages',
			packages: ['**'],
			dependencies: ['@repo/*', '@wci/*'],
			dependencyTypes: ['!local'], // Exclude the local package itself
			pinVersion: 'workspace:*',
		},
		{
			label: 'Sentry types that are compatible with toucan-js',
			dependencies: ['@sentry/types', '@sentry/tracing'],
			pinVersion: '7.76.0',
		},
		{
			label: 'toucan-js that is compatible with pinned sentry types',
			dependencies: ['toucan-js'],
			pinVersion: '3.3.1',
		},
		{
			label: 'pin vitest compatible with @cloudflare/vitest-pool-workers',
			dependencies: ['vitest', '@vitest/ui'],
			pinVersion: '2.1.9',
		},
		{
			label: 'pin opentelemetry to match otel-cf-workers',
			dependencies: ['@opentelemetry/api'],
			pinVersion: '1.9.0',
		},
		{
			label: 'pin typescript for eslint',
			dependencies: ['typescript'],
			pinVersion: '5.5.4',
		},
		{
			label: `pin eslint and all it's plugins for eslint v8`,
			dependencies: [
				'eslint',
				'@types/eslint',
				'eslint-config-prettier',
				'eslint-plugin-react-hooks',
				'eslint-plugin-unused-imports',
				'@typescript-eslint/eslint-plugin',
				'@typescript-eslint/parser',
			],
			// snapTo removes it from syncpack update list, which is the main goal
			snapTo: ['@repo/eslint-config'],
		},
		{
			label: `snap all astro/starlight apps to the same react version`,
			dependencies: ['react', 'react-dom', '@types/react'],
			packages: ['@repo/ndstories', 'uuid-rocks', 'echoback-docs', 'monorepo-rocks'],
			snapTo: ['uuid-rocks'],
		},

		// Package-specific pinned deps that are difficult to upgrade to keep in sync
		{
			label: 'Pin older tailwindcss version until I feel like updating these projects',
			packages: ['uuid-rocks', 'countify-dash', 'echoback-docs', 'monorepo-rocks', 'streamalerts'],
			dependencies: ['tailwindcss'],
			pinVersion: '3.4.17',
		},

		// email-scm-dash is in maintenance mode and annoying to upgrade stuff.
		// If I ever continue building it, I'll probably rewrite the whole
		// thing in something like orange-js
		{
			label: `email-scm-dash: maintenance mode, ignore all deps`,
			packages: ['email-scm-dash'],
			dependencies: [
				'@clerk/remix',
				'@headlessui/react',
				'@heroicons/react',
				'@remix-run/cloudflare',
				'@remix-run/cloudflare-pages',
				'@remix-run/react',
				'@sentry/remix',
				'@sentry/vite-plugin',
				'@tailwindcss/forms',
				'miniflare',
				'react',
				'react-dom',
				'@remix-run/dev',
				'@types/react',
				'@types/react-dom',
				'tailwindcss',
				'vite',
				'vite-tsconfig-paths',
			],
			isIgnored: true,
		},

		// Other stuff
		{
			label: 'ignore local packages that happen to match npm deps',
			packages: ['**'],
			dependencies: ['workflows', 'email-worker', 'streamdeck', 'shortcuts', 'email-pipeline'],
			isIgnored: true,
		},
	],
	semverGroups: [
		{
			label: 'pin all deps',
			range: '',
			dependencies: ['**'],
			packages: ['**'],
		},
	],
}

module.exports = config
