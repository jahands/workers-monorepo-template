# example-worker-echoback

## 0.2.0

### Minor Changes

- 471b744: feat: add check:workers-types to package.json scripts
- 6ed56d0: feat: rename hono middleware from use* to with*

  fixes issues where eslint thinks it's a react hook

- 11c2532: feat: modernize wrangler.jsonc for apps and worker templates

  Bumps `compatibility_date` to 2026-06-04 and adds `workers_dev: false`, `preview_urls: false`, `placement: { mode: "smart" }`, and a `CF_VERSION_METADATA` binding. `NAME` is now declared in `vars` instead of being passed at deploy time.

  Note that smart placement changes where a Worker runs, and `workers_dev: false` disables the `.workers.dev` URL.

### Patch Changes

- b1761fa: chore: update readme
- 2aade1c: chore: update workers types
- ca09f0d: chore: update deps
- 4174bf0: fix: ignore lint issue
- d069286: chore: upload sentry sourcemaps and use more explicit o11y config
- 3174e54: chore: remove unnecessary object spreading in eslint configs

  resolves #17

- c2e4c63: chore: update deps
- ce16c92: chore: update deps
- 7fa27f6: chore: update deps
- ce16c92: chore: upgrade to eslint 9
- 4bc436c: chore: update deps
- ee24328: chore: update deps
- ae6ddfc: fix: migrate types for vitest v4 compatibility
- 08229e3: chore: bump compat date to 2025-09-20
- d4dc855: chore: update deps
- 54d11ee: chore: update deps
- 11c2532: fix: rename `SENTRY_RELEASE` env var to `RELEASE`

  Sentry was never wired up, so the name was misleading. `SharedHonoEnv` now declares `RELEASE`, `runx deploy wrangler` passes `--var RELEASE:<version>`, and the example worker plus all worker templates use the new name. The `// TODO: Capture to Sentry` markers in `withOnError` are still there if you do want Sentry.

- 14a6420: chore: bump compat date to 2025-09-20
- 11c2532: feat: move wrangler build/dev/deploy into runx

  Replaces the `run-wrangler-build`/`run-wrangler-dev`/`run-wrangler-deploy` shell bins with `runx build wrangler`, `runx dev wrangler`, and `runx deploy wrangler`.
  - `build` runs `wrangler deploy --dry-run` with `--minify --outdir ./dist` and reports how long it took
  - `dev` builds workspace deps and copies `.dev.vars.example` to `.dev.vars` first, so apps and worker templates now ship a `.dev.vars.example`
  - `deploy` derives `RELEASE` from the package version and short git SHA, sets `ENVIRONMENT`, uploads source maps, and retries up to 3 times. `NAME` now comes from `wrangler.jsonc` vars instead of a `--var` flag.

- ec6ff13: chore: fix eslint type issues
- 60f83d7: fix: migrate to new vitest config format
- 11c2532: feat: add @repo/test-helpers

  A source-only package of vitest helpers, wired into the example worker as a working example:
  - `/test` - msw-based HTTP mocking via `useHttpMock()`. The server starts lazily and runs with `onUnhandledRequest: 'error'`, so un-mocked outbound requests fail the test instead of hitting the network.
  - `/matchers` - `toBeUUID()`, `toBeAfterDate()`, and a `toBeGreaterThan()` that fails instead of throwing on non-numbers
  - `/serializer` - snapshot serializers scoped per test, so enabling one doesn't leak into later tests
  - `/suite` - `testSuite()`, vitest `test` pre-extended with a harness fixture
  - root - `isWorkers()` / `isNode()` runtime detection

- 5760c04: chore: update workers types
- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- f6665a2: chore: update deps
- 0e1b031: chore: migrate from eslint to oxlint
- 11c2532: fix: validate JSON responses with zod in tests instead of type casts

  Casting `res.json()` to a type asserts a shape the test never checked. The example worker's integration tests now parse responses with zod.

- Updated dependencies [ca09f0d]
- Updated dependencies [3174e54]
- Updated dependencies [c2e4c63]
- Updated dependencies [ce16c92]
- Updated dependencies [7fa27f6]
- Updated dependencies [ce16c92]
- Updated dependencies [4bc436c]
- Updated dependencies [ee24328]
- Updated dependencies [546688f]
- Updated dependencies [d7059c9]
- Updated dependencies [d4dc855]
- Updated dependencies [54d11ee]
- Updated dependencies [11c2532]
- Updated dependencies [d52ef90]
- Updated dependencies [ec6ff13]
- Updated dependencies [6ed56d0]
- Updated dependencies [11c2532]
- Updated dependencies [3f03d99]
- Updated dependencies [f6665a2]
- Updated dependencies [0e1b031]
  - @repo/hono-helpers@0.2.0

## 0.1.4

### Patch Changes

- 50d429b: chore: update deps
- Updated dependencies [50d429b]
  - @repo/hono-helpers@0.1.4

## 0.1.3

### Patch Changes

- e3d132e: chore: update deps
- Updated dependencies [f5e4009]
- Updated dependencies [e3d132e]
- Updated dependencies [4cd042e]
  - @repo/hono-helpers@0.1.3

## 0.1.2

### Patch Changes

- 1c1dfa7: chore: rename run-eslint-workers to run-eslint-default
- Updated dependencies [1c1dfa7]
  - @repo/hono-helpers@0.1.2

## 0.1.1

### Patch Changes

- e3b75a0: chore: update deps
- Updated dependencies [15b265a]
- Updated dependencies [e3b75a0]
  - @repo/hono-helpers@0.1.1
