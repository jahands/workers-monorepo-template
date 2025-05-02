const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
	ignorePatterns: ['.*.{js,cjs}', '**/node_modules/**', '**/dist/**'],
	plugins: ['@typescript-eslint', 'import', 'unused-imports'],
	extends: ['turbo'],
	settings: {
		'import/resolver': {
			typescript: {
				project,
			},
		},
	},
	overrides: [
		// TypeScript
		{
			// enable the rule specifically for TypeScript files
			files: ['**/*.{ts,tsx,mts}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				project: true,
			},
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:import/typescript',
				'turbo',
				'prettier', // disable rules that conflict with prettier
			],
			rules: {
				'@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
				'@typescript-eslint/explicit-function-return-type': 'off',
				'react-hooks/rules-of-hooks': 'off',
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-floating-promises': 'warn',
				'unused-imports/no-unused-imports': 'warn',
				'@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
				'@typescript-eslint/no-explicit-any': 'off',
				'prefer-const': 'warn',
				'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
				'no-empty': 'warn',
			},
		},

		// Node
		{
			files: ['.eslintrc.cjs'],
			env: {
				node: true,
			},
		},

		// todo: add Astro
	],
}
