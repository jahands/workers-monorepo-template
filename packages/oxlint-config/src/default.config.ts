import { defineConfig } from 'oxlint'

import type { OxlintConfig } from 'oxlint'

export { defineConfig }

export function getConfig() {
	return {
		plugins: ['typescript', 'import', 'unicorn'],
		env: {
			builtin: true,
			es2018: true,
		},
		ignorePatterns: [
			'.astro/**',
			'.next/**',
			'.turbo/**',
			'.vercel/**',
			'.wrangler/**',
			'dist/**',
			'node_modules/**',
			'out/**',
			'worker-configuration.d.ts',
		],
		rules: {
			'@typescript-eslint/no-floating-promises': 'warn',
			'import/no-named-as-default': 'warn',
			'import/no-named-as-default-member': 'warn',
			'import/no-duplicates': 'warn',
			'no-var': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'eslint/prefer-const': 'warn',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'typescript/await-thenable': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
				},
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/array-type': [
				'warn',
				{
					default: 'array-simple',
				},
			],
			'no-empty': 'warn',
		},
		overrides: [
			{
				files: ['**/dagger/*.ts', '**/dagger/**/*.ts'],
				rules: {
					'no-unused-vars': 'off',
				},
			},
			{
				files: ['tailwind.config.ts', 'postcss.config.mjs'],
				rules: {
					'@typescript-eslint/no-require-imports': 'off',
				},
			},
		],
	} as const satisfies OxlintConfig
}
