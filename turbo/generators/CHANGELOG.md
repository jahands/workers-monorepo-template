# @repo/turbo-generators

## 0.2.0

### Minor Changes

- 11c2532: feat: create new Workers and packages in the current directory

  The `gen` and `new-package` justfile recipes no longer cd to the workspace root, and generators derive the destination from the directory they were run from, falling back to `apps/`/`packages/` at the root.

  Also fixes `new-package` post-generation steps aborting with `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN`: `fixDepsAndFormat` now runs `bun runx fix --deps`, then `pnpm install`, then `bun runx fix --format` (matching the Worker generators), and `pnpmInstall` no longer filters the install to the new package.

- eaa97a6: feat: convert turbo/generators into workspace package
- 471b744: feat: add check:workers-types to package.json scripts
- 11c2532: feat: add `workflows-worker` generator

  Scaffolds a Cloudflare Workflows Worker: a `WorkflowEntrypoint` with zod-parsed params and tagged logging, a Hono app with routes to create instances and inspect instance status, integration tests, and a `wrangler.jsonc` with a workflows binding.

  Worker generators now run `fix:workers-types` before linting, so a freshly scaffolded Worker passes checks without a committed `worker-configuration.d.ts` placeholder.

- 11c2532: feat: modernize wrangler.jsonc for apps and worker templates

  Bumps `compatibility_date` to 2026-06-04 and adds `workers_dev: false`, `preview_urls: false`, `placement: { mode: "smart" }`, and a `CF_VERSION_METADATA` binding. `NAME` is now declared in `vars` instead of being passed at deploy time.

  Note that smart placement changes where a Worker runs, and `workers_dev: false` disables the `.workers.dev` URL.

### Patch Changes

- 4174bf0: fix: ignore lint issue
- 76492e8: fix: change to type: module
- ae6ddfc: fix: migrate types for vitest v4 compatibility
- d4dc855: chore: update deps
- 11c2532: chore: remove dead and pass-through bin scripts

  Deletes `get-version`/`get-branch` (only used by the removed wrangler deploy bin) and the `run-vite-build`/`run-vite-dev`/`run-vite-preview`/`run-vitest-ci` wrappers - scripts call `vite`/`vitest` directly instead.

  The remaining bins were hardened: `run-vitest` runs explicitly in `run` mode with a timeout, `run-tsc` takes a `DISABLE_TSGO` escape hatch, `run-oxlint` takes `FIX_OXLINT`, `run-fix-deps` uses `syncpack fix` (renamed in syncpack 15) and no longer fails when there is nothing to install. Adds `run-vitest-watch`.

- 11c2532: fix: rename `SENTRY_RELEASE` env var to `RELEASE`

  Sentry was never wired up, so the name was misleading. `SharedHonoEnv` now declares `RELEASE`, `runx deploy wrangler` passes `--var RELEASE:<version>`, and the example worker plus all worker templates use the new name. The `// TODO: Capture to Sentry` markers in `withOnError` are still there if you do want Sentry.

- 0a3d9b9: chore: add @turbo/gen to dependencies
- 11c2532: feat: move wrangler build/dev/deploy into runx

  Replaces the `run-wrangler-build`/`run-wrangler-dev`/`run-wrangler-deploy` shell bins with `runx build wrangler`, `runx dev wrangler`, and `runx deploy wrangler`.
  - `build` runs `wrangler deploy --dry-run` with `--minify --outdir ./dist` and reports how long it took
  - `dev` builds workspace deps and copies `.dev.vars.example` to `.dev.vars` first, so apps and worker templates now ship a `.dev.vars.example`
  - `deploy` derives `RELEASE` from the package version and short git SHA, sets `ENVIRONMENT`, uploads source maps, and retries up to 3 times. `NAME` now comes from `wrangler.jsonc` vars instead of a `--var` flag.

- 60f83d7: fix: migrate to new vitest config format
- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- 07c8414: fix: fix ai slop in slugify.ts
- 0e1b031: chore: migrate from eslint to oxlint
