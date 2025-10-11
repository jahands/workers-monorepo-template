import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboConfig from 'eslint-config-turbo/flat'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'
import * as tseslint from 'typescript-eslint'

import { getDirname, getGitIgnoreFiles, getTsconfigRootDir } from './helpers'

import type { Linter } from 'eslint'

export type { ConfigObject as Config } from '@eslint/core'

export { defineConfig }

const compat = new FlatCompat({
	// This helps FlatCompat resolve plugins relative to this config file
	baseDirectory: getDirname(import.meta.url),
})

export function getConfig(importMetaUrl: string): Array<Linter.Config<Linter.RulesRecord>> {
	return defineConfig([
		// Global ignores
		{
			ignores: [
				'.*.{js,cjs}',
				'**/*.{js,cjs}',
				'**/node_modules/**',
				'**/dist/**',
				'eslint.config.ts',
				'**/eslint.config.ts',
				'**/worker-configuration.d.ts',
			],
		},

		getGitIgnoreFiles(importMetaUrl),

		eslint.configs.recommended,
		tseslint.configs.recommended,
		importPlugin.flatConfigs.recommended,
		turboConfig,

		// TypeScript Configuration
		{
			files: ['**/*.{ts,tsx,mts,mjs}'],
			languageOptions: {
				parser: tsEslintParser,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					sourceType: 'module',
					projectService: true,
					tsconfigRootDir: getTsconfigRootDir(importMetaUrl),
				},
			},
			settings: {
				'import/resolver': {
					typescript: {
						project: `${getTsconfigRootDir(importMetaUrl) || '.'}/tsconfig.json`,
					},
				},
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts', '.tsx', '.mts'],
				},
			},
			rules: {
				...tsEslintPlugin.configs.recommended.rules,
				...importPlugin.configs?.typescript.rules,

				'@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-floating-promises': 'warn',
				'@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
				// Note: you must disable the base rule as it can report incorrect errors
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
					},
				],
				// disabling because it was annoying with cloudflare:test types
				'@typescript-eslint/no-empty-object-type': 'off',

				'@typescript-eslint/no-explicit-any': 'off',
				'import/no-named-as-default': 'off',
				'import/no-named-as-default-member': 'off',
				'prefer-const': 'warn',
				'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
				'no-empty': 'warn',

				// Add Prettier last to override other formatting rules
				...eslintConfigPrettier.rules,
			},
		},

		// Import plugin's TypeScript specific rules using FlatCompat
		// This should apply to the same files as the TypeScript configuration above.
		// We apply it as a separate configuration object to ensure `files` matches.
		compat.extends('plugin:import/typescript').map((config) => ({
			...config,
			files: ['**/*.{ts,tsx,mts,mjs}'], // Ensure it targets the same TypeScript files
		})),

		{
			files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts', '**/mocks.ts'],
			rules: {
				// this is having issues with @cloudflare/vitest-pool-workers types
				'import/no-unresolved': 'off',
			},
		},
		{
			files: ['**/*.{ts,tsx}'],
			rules: {
				'import/no-unresolved': [
					'error',
					{
						ignore: [
							// Cloudflare Workers runtime modules
							'^cloudflare:',
							// Virtual modules from build tools
							'^virtual:',
							// Astro content collections
							'^astro:',
							// Node.js built-in modules with node: prefix
							'^node:',
						],
					},
				],
			},
		},
		{
			files: ['tailwind.config.ts', 'postcss.config.mjs'],
			rules: {
				'@typescript-eslint/no-require-imports': 'off',
			},
		},
		{
			files: ['**/test/fixtures/**/*'],
			rules: {
				'import/no-unresolved': 'off',
			},
		},

		// Prettier (should be last to override other formatting rules)
		{ rules: eslintConfigPrettier.rules },
	])
}
