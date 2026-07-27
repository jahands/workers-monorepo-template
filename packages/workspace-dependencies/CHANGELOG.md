# @repo/workspace-dependencies

## 0.1.4

### Patch Changes

- 7797ce2: chore: update tsconfig.json
- ca09f0d: chore: update deps
- 3174e54: chore: remove unnecessary object spreading in eslint configs

  resolves #17

- c2e4c63: chore: update deps
- ce16c92: chore: update deps
- 7fa27f6: chore: update deps
- ce16c92: chore: upgrade to eslint 9
- 4bc436c: chore: update deps
- ee24328: chore: update deps
- 546688f: chore: import from zod
- d4dc855: chore: update deps
- eaa97a6: chore: remove unused dependencies
- 54d11ee: chore: update deps
- ec6ff13: chore: fix eslint type issues
- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- f6665a2: chore: update deps
- 0e1b031: chore: migrate from eslint to oxlint

## 0.1.3

### Patch Changes

- f5e4009: chore: update imports to use zod/v4
- e3d132e: chore: update deps
- 4cd042e: chore: remove custom Zod package

  decided this was too complex for a template

## 0.1.2

### Patch Changes

- 1c1dfa7: chore: rename run-eslint-workers to run-eslint-default
- Updated dependencies [b1a6e35]
- Updated dependencies [1c1dfa7]
- Updated dependencies [442c820]
  - @repo/tools@0.3.0
  - @repo/zod@0.1.1

## 0.1.1

### Patch Changes

- e3b75a0: chore: update deps
- b939c69: fix: only export z from zod

  There seem to be intermittent issues with `turbo generate` when exporting `*`, so only exporting `z` for now.

- Updated dependencies [d0fa18b]
- Updated dependencies [15b265a]
- Updated dependencies [43e0e0d]
- Updated dependencies [e650f5e]
- Updated dependencies [e3b75a0]
- Updated dependencies [ec87476]
- Updated dependencies [b615c80]
- Updated dependencies [db50406]
- Updated dependencies [1a85730]
- Updated dependencies [53190e7]
- Updated dependencies [b2a9f0d]
- Updated dependencies [15b265a]
- Updated dependencies [5cb6aae]
- Updated dependencies [366930e]
  - @repo/tools@0.2.0
  - @repo/zod@0.1.0
