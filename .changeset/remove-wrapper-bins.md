---
'@repo/tools': patch
'@repo/turbo-generators': patch
---

chore: remove dead and pass-through bin scripts

Deletes `get-version`/`get-branch` (only used by the removed wrangler deploy bin) and the `run-vite-build`/`run-vite-dev`/`run-vite-preview`/`run-vitest-ci` wrappers - scripts call `vite`/`vitest` directly instead.

The remaining bins were hardened: `run-vitest` runs explicitly in `run` mode with a timeout, `run-tsc` takes a `DISABLE_TSGO` escape hatch, `run-oxlint` takes `FIX_OXLINT`, `run-fix-deps` uses `syncpack fix` (renamed in syncpack 15) and no longer fails when there is nothing to install. Adds `run-vitest-watch`.
