import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboConfig from 'eslint-config-turbo/flat'
// @ts-ignore eslint-plugin-import has no types
import * as importPlugin from 'eslint-plugin-import'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import globals from 'globals/index.js'
import tseslint from 'typescript-eslint'

import { getDirname, getGitIgnoreFiles, getTsconfigRootDir } from './helpers'

export { defineConfig }

const compat = new FlatCompat({
	// This helps FlatCompat resolve plugins relative to this config file
	baseDirectory: getDirname(import.meta.url),
})

export function getConfig(importMetaUrl: string) {
	return defineConfig([
		// Global ignores
		{
			ignores: [
				'.*.{js,cjs}',
				'**/*.{js,cjs}',
				'**/node_modules/**',
				'**/dist/**',
				'**/dist2/**',
				'**/dagger/sdk/**',
				'eslint.config.ts',
				'**/eslint.config.ts',
				'**/eslint.*.config.ts',
				'**/worker-configuration.d.ts',
			],
		},

		...getGitIgnoreFiles(importMetaUrl),

		eslint.configs.recommended,
		tseslint.configs.recommended,
		importPlugin.flatConfigs?.recommended,
		...turboConfig,

		// TypeScript Configuration
		{
			files: ['**/*.{ts,tsx,mts}'],
			languageOptions: {
				parser: tsEslintParser,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					sourceType: 'module',
					project: true,
					tsconfigRootDir: getTsconfigRootDir(importMetaUrl),
				},
			},
			plugins: {
				'unused-imports': unusedImportsPlugin,
			},
			settings: {
				'import/resolver': {
					typescript: {
						project: './tsconfig.json',
					},
				},
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts', '.tsx', '*.mts'],
				},
			},
			rules: {
				...tsEslintPlugin.configs.recommended.rules,
				...importPlugin.configs?.typescript.rules,

				'@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/ban-ts-comment': 'off',
				'@typescript-eslint/no-floating-promises': 'warn',
				'unused-imports/no-unused-imports': 'warn',
				'@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
					},
				],
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
		...compat.extends('plugin:import/typescript').map((config) => ({
			...config,
			files: ['**/*.{ts,tsx,mjs}'],
		})),

		// Configuration for Node files
		{
			files: ['eslint.config.ts', 'eslint.*.config.mts'],
			languageOptions: {
				parserOptions: {
					ecmaVersion: 2022,
					sourceType: 'module',
					project: true,
				},
				globals: globals.node,
			},
		},
		{
			files: ['**/dagger/*.ts', '**/dagger/**/*.ts'],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
		{
			files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts', '**/mocks.ts'],
			rules: {
				'import/no-unresolved': 'off',
			},
		},
		{
			files: ['**/*.ts'],
			rules: {
				'import/no-unresolved': 'off',
			},
		},
		{
			files: ['tailwind.config.ts', 'postcss.config.mjs'],
			rules: {
				'@typescript-eslint/no-require-imports': 'off',
			},
		},

		// Prettier (should be last to override other formatting rules)
		{ rules: eslintConfigPrettier.rules },
	])
}
