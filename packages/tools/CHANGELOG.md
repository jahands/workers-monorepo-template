# @repo/tools

## 0.4.0

### Minor Changes

- 8940e93: feat: add build bun cmd
- e3c8f04: feat: migrate from tsc to tsgo
- 11c2532: feat: fix package exports and add workspace introspection to runx

  The `exports` map pointed at `src/lib/*`, which no longer exists - it now exposes `./path`, `./environment`, `./workspace`, and `./package`. Adds `getWorkspacePackages`, `getWorkspacePackage`, `getWorkersProjects`, and `globProjectFiles` (used by `turbo.config.ts` to derive its build task list), plus a zod-validated `getPackageJson`.

  Also anchors `getRepoRoot()` to `import.meta.dirname` so it resolves the same regardless of cwd, runs the workers-types check independently of `--format` and includes it in `runx check` by default, and gives prettier a stable cache location so turbo can cache it.

- 11c2532: feat: move wrangler build/dev/deploy into runx

  Replaces the `run-wrangler-build`/`run-wrangler-dev`/`run-wrangler-deploy` shell bins with `runx build wrangler`, `runx dev wrangler`, and `runx deploy wrangler`.
  - `build` runs `wrangler deploy --dry-run` with `--minify --outdir ./dist` and reports how long it took
  - `dev` builds workspace deps and copies `.dev.vars.example` to `.dev.vars` first, so apps and worker templates now ship a `.dev.vars.example`
  - `deploy` derives `RELEASE` from the package version and short git SHA, sets `ENVIRONMENT`, uploads source maps, and retries up to 3 times. `NAME` now comes from `wrangler.jsonc` vars instead of a `--var` flag.

- d0bf900: feat: improve scripts based on shellcheck lint suggestions
- a946b57: feat(runx): add shfmt for shell script formatting

  Integrates shfmt with check --format and fix --format commands.
  Adds a dedicated shfmt command that can skip if tools are missing.

  resolves #16

- 471b744: feat: add workers types to check cmd and remove old git based version

### Patch Changes

- ed5cb4c: fix: pass in args to wrangler types cmd in run-wrangler-types
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
- 58147c3: fix: don't needlessly read tsconfig
- abf40ba: fix: properly resolve tsc configs
- 4174900: chore: inherit stdio for format shell fix/check

  this already outputs very little so should be fine to do this

- 2452bc6: chore: add .cmd.ts suffix to cmd files
- 7c5e37c: chore: add todo to run-tsc
- d4dc855: chore: update deps
- c68dea1: chore: use exec in shell wrappers to improve performance

  using exec replaces the shell process instead of creating a child, which avoids an unnecessary wrapper process and improves signal handling.

  also moved away from #!/usr/bin/env to improve security (no injecting custom shells into env)

- 79d4e30: fix: only include .sh and extensionless files in shfmt
- 54d11ee: chore: update deps
- 11c2532: chore: remove dead and pass-through bin scripts

  Deletes `get-version`/`get-branch` (only used by the removed wrangler deploy bin) and the `run-vite-build`/`run-vite-dev`/`run-vite-preview`/`run-vitest-ci` wrappers - scripts call `vite`/`vitest` directly instead.

  The remaining bins were hardened: `run-vitest` runs explicitly in `run` mode with a timeout, `run-tsc` takes a `DISABLE_TSGO` escape hatch, `run-oxlint` takes `FIX_OXLINT`, `run-fix-deps` uses `syncpack fix` (renamed in syncpack 15) and no longer fails when there is nothing to install. Adds `run-vitest-watch`.

- 11c2532: fix: rename `SENTRY_RELEASE` env var to `RELEASE`

  Sentry was never wired up, so the name was misleading. `SharedHonoEnv` now declares `RELEASE`, `runx deploy wrangler` passes `--var RELEASE:<version>`, and the example worker plus all worker templates use the new name. The `// TODO: Capture to Sentry` markers in `withOnError` are still there if you do want Sentry.

- 4957efe: fix: add minify flag to run-wrangler-deploy
- 99c1934: fix: don't throw if there are no .sh files
- 7cec4eb: chore: use consistent shabang in packages/tools/bin
- ec6ff13: chore: fix eslint type issues
- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- f6665a2: chore: update deps
- 1bdf764: chore: pipe output to stderr
- c35dd7d: chore: use default turbo concurrency
- 0e1b031: chore: migrate from eslint to oxlint
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
