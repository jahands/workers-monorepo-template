---
'@repo/tools': patch
'@repo/turbo-generators': patch
'example-worker-echoback': patch
---

chore: remove dead and pass-through bin scripts

Deletes `get-version`/`get-branch` (unreferenced) and the `run-vite-*`/`run-vitest-ci` wrappers - scripts now call `vite`/`vitest` directly. Apps and worker templates also ship a `.dev.vars.example` so the `.dev.vars` bootstrap in `runx dev wrangler` actually has something to copy.
