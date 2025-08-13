# @repo/eslint-config

## 0.1.2

### Patch Changes

- ec01ba8: fix: properly resolve tsconfig.json in eslint config
- 3174e54: chore: remove unnecessary object spreading in eslint configs

  resolves #17

- ce16c92: chore: update deps
- ce16c92: chore: upgrade to eslint 9
- 63db136: fix: ignore type issues due to non-breaking conflict
- 358baa9: chore: improve eslint configs
  - remove unused dependencies (eslint-plugin-unused-imports, jiti)
  - switch from deprecated project: true to projectService: true for TypeScript parser
  - fix TypeScript ESLint v8 compatibility with proper type casting
  - improve file pattern consistency across configurations (added .mts support)
  - fix import plugin's TypeScript resolver file patterns
  - don't disable rules-of-hooks on tsx/jsx files
  - add clarifying comments for disabled rules

  resolves #17

- 54d11ee: chore: update deps
- f6665a2: chore: update deps

## 0.1.1

### Patch Changes

- e3b75a0: chore: update deps
