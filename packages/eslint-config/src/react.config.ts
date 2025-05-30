import tsEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import * as reactHooks from 'eslint-plugin-react-hooks'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

import { defineConfig, getConfig } from './default.config'
import { getTsconfigRootDir } from './helpers'

export function getReactConfig(importMetaUrl: string) {
	return defineConfig([
		...getConfig(importMetaUrl),
		{
			files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
			plugins: {
				react,
				'unused-imports': unusedImportsPlugin,
			},
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
		},
		reactHooks.configs['recommended-latest'],
		{
			rules: {
				// this commonly causes false positives with Hono middleware
				// that have a similar naming scheme (e.g. useSentry())
				'react-hooks/rules-of-hooks': 'off',
			},
		},

		// Prettier (should be last to override other formatting rules)
		{ rules: eslintConfigPrettier.rules },
	])
}
