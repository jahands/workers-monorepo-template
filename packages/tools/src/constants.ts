/**
 * List of packages that need building before running things like tests
 */
export const builtPackages = [
	'@repo/test-helpers',
	// @repo/otel is supposed to be pre-built by vitest,
	// but it has been really flakey (example: https://gist.uuid.rocks/jh/ef617518b0ee4ad88fc4b59901fb35bf)
	'@repo/otel',
	'@repo/notion-client',
] as const satisfies string[]
