# @repo/oxlint-config

## 0.1.1

### Patch Changes

- d4dc855: chore: update deps
- 11c2532: fix: remove leftover dagger-specific lint override

  Nothing in the repo uses dagger, so the `no-unused-vars` override for `**/dagger/**` was dead config.

- 11c2532: chore: update toolchain and migrate to pnpm 11

  Updates pnpm 11.2.2, bun 1.3.12, turbo 2.10.1, wrangler 4.111.0, vitest 4.1.5, vitest-pool-workers 0.16.18, workers-types v5, oxlint 1.60.0, syncpack 15.1.2, and prettier 3.8.3. Worker template pins were refreshed to match (hono 4.12.9, workers-tagged-logger 1.0.0), and vitest configs set `remoteBindings: false`.

  For pnpm 11, `.npmrc` was removed and its settings moved into `pnpm-workspace.yaml`, `onlyBuiltDependencies` became the new `allowBuilds` map, and `verifyDepsBeforeRun: error` stops Turbo from racing concurrent implicit installs.

- 0e1b031: chore: migrate from eslint to oxlint
