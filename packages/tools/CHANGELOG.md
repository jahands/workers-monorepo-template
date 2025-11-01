# @repo/tools

## 0.4.0

### Minor Changes

- 8940e93: feat: add build bun cmd
- d0bf900: feat: improve scripts based on shellcheck lint suggestions
- a946b57: feat(runx): add shfmt for shell script formatting

  Integrates shfmt with check --format and fix --format commands.
  Adds a dedicated shfmt command that can skip if tools are missing.

  resolves #16

### Patch Changes

- 3174e54: chore: remove unnecessary object spreading in eslint configs

  resolves #17

- a73c2f9: chore: remove run-turbo-gen (no longer needed)
- 09a661d: chore: switch back to stdio: inherit in prettier and set log level
- c2e4c63: chore: update deps
- ce16c92: chore: update deps
- ce16c92: chore: upgrade to eslint 9
- 4bc436c: chore: update deps
- ee24328: chore: update deps
- 546688f: chore: import from zod
- 4174900: chore: inherit stdio for format shell fix/check

  this already outputs very little so should be fine to do this

- 2452bc6: chore: add .cmd.ts suffix to cmd files
- c68dea1: chore: use exec in shell wrappers to improve performance

  using exec replaces the shell process instead of creating a child, which avoids an unnecessary wrapper process and improves signal handling.

  also moved away from #!/usr/bin/env to improve security (no injecting custom shells into env)

- 79d4e30: fix: only include .sh and extensionless files in shfmt
- 54d11ee: chore: update deps
- 4957efe: fix: add minify flag to run-wrangler-deploy
- 99c1934: fix: don't throw if there are no .sh files
- 7cec4eb: chore: use consistent shabang in packages/tools/bin
- ec6ff13: chore: fix eslint type issues
- f6665a2: chore: update deps
- 1bdf764: chore: pipe output to stderr
- bf2f746: chore: formatting

## 0.3.2

### Patch Changes

- 50d429b: chore: update deps
- 5b3a74f: chore: update deps

## 0.3.1

### Patch Changes

- f5e4009: chore: update imports to use zod/v4
- e3d132e: chore: update deps
- 4cd042e: chore: remove custom Zod package

  decided this was too complex for a template

## 0.3.0

### Minor Changes

- 442c820: feat: dynamically import typescript instead of having separate entrypoint

  also adds a command to build with tsc

### Patch Changes

- b1a6e35: chore: rename \_ts to #ts
- 1c1dfa7: chore: rename run-eslint-workers to run-eslint-default
- Updated dependencies [1c1dfa7]
  - @repo/zod@0.1.1

## 0.2.0

### Minor Changes

- e650f5e: feat: only output from turbo build when it fails

  reduces noise when running `just gen`

- b615c80: feat: allow passing in sourcemap
- 53190e7: feat: clean up scripts

### Patch Changes

- d0fa18b: fix: run format after updating packages
- 15b265a: chore: update deps
- 43e0e0d: chore: move minify to flag
- e3b75a0: chore: update deps
- ec87476: chore: add tests
- db50406: fix: don't set external when platform=node
- 1a85730: feat: add --types flag to bundle-lib cmd
- b2a9f0d: fix: define require in tsconfig.ts to ensure it works in modules
- 15b265a: chore: switch to tree-shakable imports
- 5cb6aae: fix: run syncpack fix-mismatches after update
- 366930e: fix: minify output for node
  - @repo/zod@0.1.0
