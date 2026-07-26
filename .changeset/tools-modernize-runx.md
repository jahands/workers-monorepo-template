---
'example-worker-echoback': patch
'@repo/turbo-generators': patch
'@repo/tools': patch
---

feat: modernize the @repo/tools runx CLI

- fix broken package exports (`./path`, `./environment`, `./workspace`, `./package`)
- add workspace introspection helpers (`getWorkspacePackages`, `getWorkersProjects`, `globProjectFiles`)
- add `runx build wrangler` (replaces `run-wrangler-build`)
- build workspace deps and bootstrap `.dev.vars` before `wrangler dev`
- run workers-types check independently of `--format`
- use a stable prettier cache location
- harden bin scripts (explicit `vitest run`, `DISABLE_TSGO`/`FIX_OXLINT` escape hatches, `syncpack fix`, `run-vitest-watch`)
