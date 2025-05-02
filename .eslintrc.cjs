// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
	ignorePatterns: ['apps/**', 'packages/**'],
	extends: ['@repo/eslint-config/default.cjs'],
	overrides: [
		{
			files: 'turbo/generators/**/*.ts',
			rules: {
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
}
