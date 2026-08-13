# @repo/hono-helpers

## 0.2.0

### Minor Changes

- 11c2532: fix: rename `SENTRY_RELEASE` env var to `RELEASE`

  Sentry was never wired up, so the name was misleading. `SharedHonoEnv` now declares `RELEASE`, `runx deploy wrangler` passes `--var RELEASE:<version>`, and the example worker plus all worker templates use the new name. The `// TODO: Capture to Sentry` markers in `withOnError` are still there if you do want Sentry.

- 6ed56d0: feat: rename hono middleware from use* to with*

  fixes issues where eslint thinks it's a react hook

### Patch Changes

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
- d7059c9: fix: only cache 200 responses
- d4dc855: chore: update deps
- 54d11ee: chore: update deps
- d52ef90: fix: don't log sensitive headers
- ec6ff13: chore: fix eslint type issues
- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- 3f03d99: fix: redact more sensitive search params
- f6665a2: chore: update deps
- 0e1b031: chore: migrate from eslint to oxlint

## 0.1.4

### Patch Changes

- 50d429b: chore: update deps

## 0.1.3

### Patch Changes

- f5e4009: chore: update imports to use zod/v4
- e3d132e: chore: update deps
- 4cd042e: chore: remove custom Zod package

  decided this was too complex for a template

## 0.1.2

### Patch Changes

- 1c1dfa7: chore: rename run-eslint-workers to run-eslint-default
- Updated dependencies [1c1dfa7]
  - @repo/zod@0.1.1

## 0.1.1

### Patch Changes

- 15b265a: chore: update deps
- e3b75a0: chore: update deps
  - @repo/zod@0.1.0
