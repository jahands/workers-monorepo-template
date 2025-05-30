# ESLint 8 to 9 Migration Guide for TypeScript Monorepos

This guide provides step-by-step instructions for migrating a TypeScript monorepo from ESLint 8 (legacy config) to ESLint 9 (flat config). This guide is designed to be used by LLMs for automated migration.

## Overview

**Before (ESLint 8):**
- Uses `.eslintrc.cjs` files throughout the monorepo
- Single shared config: `packages/eslint-config/default.cjs`
- Simple package.json exports
- Legacy configuration format

**After (ESLint 9):**
- Uses `eslint.config.ts` files throughout the monorepo
- Multiple shared configs with TypeScript support
- Enhanced package.json exports
- Flat configuration format with better TypeScript integration

## Migration Steps

### Step 1: Update Shared ESLint Config Package

#### 1.1 Update package.json

Replace the existing `packages/eslint-config/package.json` with updated exports and dependencies:

```json
{
	"name": "@repo/eslint-config",
	"version": "0.2.3",
	"private": true,
	"sideEffects": false,
	"exports": {
		".": "./src/default.config.ts",
		"./react": "./src/react.config.ts"
	},
	"devDependencies": {
		"@eslint/compat": "1.2.9",
		"@eslint/js": "9.27.0",
		"@types/eslint": "9.6.1",
		"@types/node": "22.15.21",
		"@typescript-eslint/eslint-plugin": "8.32.1",
		"@typescript-eslint/parser": "8.32.1",
		"eslint": "9.27.0",
		"eslint-config-prettier": "10.1.5",
		"eslint-config-turbo": "2.5.3",
		"eslint-import-resolver-typescript": "4.3.5",
		"eslint-plugin-astro": "1.3.1",
		"eslint-plugin-import": "2.31.0",
		"eslint-plugin-jsx-a11y": "6.10.2",
		"eslint-plugin-only-warn": "1.1.0",
		"eslint-plugin-react": "7.37.5",
		"eslint-plugin-react-hooks": "5.2.0",
		"eslint-plugin-unused-imports": "4.1.4",
		"globals": "16.1.0",
		"typescript": "5.8.2",
		"typescript-eslint": "8.32.1",
		"vitest": "3.1.4"
	}
}
```

#### 1.2 Create src/ directory structure

Create `packages/eslint-config/src/` directory and add the following files:

#### 1.3 Create helpers.ts

```typescript
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'

import type { FlatConfig } from '@eslint/compat'

export function getDirname(importMetaUrl: string) {
	const __filename = fileURLToPath(importMetaUrl)
	return path.dirname(__filename)
}

export function getGitIgnoreFiles(importMetaUrl: string) {
	// always include the root gitignore file
	const rootGitignorePath = fileURLToPath(new URL('../../../.gitignore', import.meta.url))

	const ignoreFiles: FlatConfig[] = [includeIgnoreFile(rootGitignorePath)]

	const packageDir = getDirname(importMetaUrl)
	const packageGitignorePath = path.join(packageDir, '.gitignore')
	if (existsSync(packageGitignorePath)) {
		ignoreFiles.push(includeIgnoreFile(packageGitignorePath))
	}

	return ignoreFiles
}

export function getTsconfigRootDir(importMetaUrl: string) {
	const tsconfigRootDir = getDirname(importMetaUrl)
	return existsSync(path.join(tsconfigRootDir, 'tsconfig.json')) ? tsconfigRootDir : undefined
}
```

#### 1.4 Create default.config.ts

```typescript
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
```

#### 1.5 Create react.config.ts

```typescript
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
```

#### 1.6 Create eslint.config.ts for the config package itself

```typescript
import { defineConfig, getConfig } from './src/default.config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
```

#### 1.7 Remove old files

Delete the old `packages/eslint-config/default.cjs` file.

### Step 2: Update Root ESLint Configuration

Replace the root `.eslintrc.cjs` with `eslint.config.ts`:

```typescript
import { defineConfig, getConfig } from '@repo/eslint-config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
```

Delete the old `.eslintrc.cjs` file.

### Step 3: Update Package ESLint Configurations

For each package/app in the monorepo:

#### For packages using default config:

Replace `.eslintrc.cjs` with `eslint.config.ts`:

```typescript
import { defineConfig, getConfig } from '@repo/eslint-config'

const config = getConfig(import.meta.url)

export default defineConfig([...config])
```

#### For packages using React config:

Replace `.eslintrc.cjs` with `eslint.config.ts`:

```typescript
import { defineConfig } from '@repo/eslint-config'
import { getReactConfig } from '@repo/eslint-config/react'

const config = getReactConfig(import.meta.url)

export default defineConfig([...config])
```

### Step 4: Update TypeScript Configuration

Since we're introducing `eslint.config.ts` files throughout the monorepo, we need to exclude them from TypeScript compilation.

#### 4.1 Update shared TypeScript configs

**For LLMs:** 

1. **Find the TypeScript config package** - Look for a package like `packages/typescript-config/` or similar that contains shared TypeScript configurations

2. **Identify all TypeScript config files** - List all `.json` files in that package

3. **For each config file that contains an `exclude` array:**
   - Add `"${configDir}/eslint.config.ts"` to the exclude array
   - Preserve all existing excludes
   - Keep the same JSON formatting and structure

4. **Also check individual package `tsconfig.json` files** - If any package has custom `exclude` arrays in their `tsconfig.json`, add the eslint config exclusion there as well

**Example transformation:**
```json
// Before
"exclude": ["${configDir}/node_modules/", "${configDir}/dist/"]

// After  
"exclude": ["${configDir}/node_modules/", "${configDir}/dist/", "${configDir}/eslint.config.ts"]
```

This prevents TypeScript from trying to compile the new ESLint configuration files.

### Step 5: Update Scripts and Dependencies

#### 5.1 Dependencies

**For monorepos with pnpm workspaces:** No additional ESLint dependencies needed! The `eslint` package in `@repo/eslint-config` will be hoisted and available workspace-wide.

**Required `.npmrc` configuration:**
```
auto-install-peers=true
public-hoist-pattern[]=*eslint*
```

The `public-hoist-pattern[]=*eslint*` setting is what specifically allows ESLint packages to be hoisted and their binaries to be available workspace-wide.

**Note:** If you encounter "eslint: command not found" errors, this is due to a pnpm `.bin` symlink issue. See the troubleshooting section below for the solution.

#### 4.2 Update lint scripts

If you have lint scripts, ensure they work with the new config:

```json
{
	"scripts": {
		"lint": "eslint .",
		"lint:fix": "eslint . --fix"
	}
}
```

### Step 6: Migration Checklist

Use this checklist to ensure complete migration:

- [ ] Updated `packages/eslint-config/package.json` with new exports and dependencies
- [ ] Created `packages/eslint-config/src/` directory structure
- [ ] Created `packages/eslint-config/src/helpers.ts`
- [ ] Created `packages/eslint-config/src/default.config.ts`
- [ ] Created `packages/eslint-config/src/react.config.ts`
- [ ] Created `packages/eslint-config/eslint.config.ts`
- [ ] Deleted old `packages/eslint-config/default.cjs`
- [ ] Updated all TypeScript configs in `packages/typescript-config/` to exclude `eslint.config.ts`
- [ ] Replaced root `.eslintrc.cjs` with `eslint.config.ts`
- [ ] Replaced all package `.eslintrc.cjs` files with `eslint.config.ts`
- [ ] Verified ESLint dependencies are properly hoisted (no additional dependencies needed)
- [ ] Tested linting works using repository's existing commands
- [ ] Verified auto-fix works using repository's existing commands

### Step 7: Common Issues and Solutions

#### Issue: Import errors for @repo/eslint-config

**Solution:** Ensure the package.json exports are correct and rebuild workspace dependencies:
```bash
pnpm install
```

#### Issue: "eslint: command not found" in pnpm workspaces

**Solution:** This is a known pnpm issue where `.bin` symlinks don't get updated properly. Remove all node_modules and reinstall:
```bash
find . -type d -name node_modules -delete
pnpm install
```

With proper dependency hoisting via `.npmrc` (specifically `auto-install-peers=true` and `public-hoist-pattern[]=*eslint*`), the eslint binary from `@repo/eslint-config` should be available workspace-wide without adding to root package.json.

#### Issue: TypeScript parser errors

**Solution:** Verify that `@typescript-eslint/parser` version matches across all packages and that `tsconfig.json` exists in the package root.

#### Issue: Plugin resolution errors

**Solution:** Ensure all required ESLint plugins are installed in the `packages/eslint-config` package, not in individual packages.

### Step 8: Testing the Migration

After migration, test the new ESLint configuration:

#### 8.1 Analyze repository tooling

**For LLMs:** Use the available tools to analyze the repository structure and determine the appropriate linting commands:

1. **Check package.json scripts** to identify lint-related commands:
   - Look for scripts containing "lint", "check", "eslint" 
   - Note the package manager (pnpm, npm, yarn)

2. **Check for build tools**:
   - Look for `Justfile`, `Makefile`, or similar in the root
   - Check `turbo.json` or `turbo.jsonc` for lint tasks
   - Look for other monorepo tools (Lerna, Nx, etc.)

3. **Determine the correct commands** based on what you find:
   - If Justfile exists with lint/check commands → use `just <command>`
   - If package.json has lint scripts → use `<package-manager> run <script>`
   - If turbo.json has lint tasks → use `<package-manager> turbo <task>`
   - Otherwise → use direct ESLint commands

#### 8.2 Install dependencies and test

1. **Install dependencies** using the repository's package manager
2. **Run the linting commands** you identified above
3. **Test auto-fix** if available
4. **Verify individual packages** can be linted if needed

#### 8.3 Verify migration success

Ensure these work without errors:
- [ ] ESLint runs without configuration errors
- [ ] TypeScript files are properly linted
- [ ] Import/export rules work correctly
- [ ] Auto-fix functionality works
- [ ] All packages can be linted individually

## Notes for LLMs

When automating this migration:

1. **Always backup** existing ESLint configurations before starting
2. **Check for custom rules** in existing `.eslintrc.cjs` files and port them to the new config
3. **Verify package structure** matches the expected monorepo layout
4. **Verify pnpm workspace setup** - ensure `.npmrc` has proper hoisting configuration
5. **If "eslint: command not found"** - remove all node_modules (`find . -type d -name node_modules -delete`) and reinstall to fix pnpm .bin symlink issues
6. **Test thoroughly** after migration by running lint commands
7. **Handle React packages** separately using the React config
8. **Update any CI/CD scripts** that reference the old ESLint configuration paths
9. **Check for additional ignore patterns** that may need to be added to the global ignores

The migration preserves all existing functionality while providing better TypeScript integration and modern ESLint 9 features.
