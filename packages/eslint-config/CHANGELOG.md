# @repo/eslint-config

## 0.2.0

### Minor Changes

- 4ca1868: feat: use explicit return types in eslint configs
- 6ed56d0: feat: rename hono middleware from use* to with*

  fixes issues where eslint thinks it's a react hook

### Patch Changes

- ec01ba8: fix: properly resolve tsconfig.json in eslint config
- 3174e54: chore: remove unnecessary object spreading in eslint configs

  resolves #17

- c2e4c63: chore: update deps
- ce16c92: chore: update deps
- ce16c92: chore: upgrade to eslint 9
- 520b23e: fix: add @eslint/eslintrc to dependencies
- 4bc436c: chore: update deps
- 63db136: fix: ignore type issues due to non-breaking conflict
- e091787: fix: add missing dependency and switch to tools tsconfig
- 33183c5: fix: use type-only export
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
- 43ebb87: chore: update deps (eslint)
- ec6ff13: chore: fix eslint type issues
- 87dfac8: fix: add jiti to eslint deps
- f6665a2: chore: update deps
- b502c1e: chore: remove unnecessary type cast
- 18e5b01: chore: update import

## 0.1.1

### Patch Changes

- e3b75a0: chore: update deps
