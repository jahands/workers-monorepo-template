---
'@repo/tools': minor
'example-worker-echoback': patch
'@repo/turbo-generators': patch
---

feat: move wrangler dev/deploy into runx, removing wrapper bin scripts

Deletes the `run-wrangler-dev` and `run-wrangler-deploy` shell bins. Apps now use `runx dev wrangler` (builds workspace deps and bootstraps `.dev.vars` first) and the new `runx deploy wrangler` (sets `RELEASE`/`ENVIRONMENT` vars, minifies, uploads sourcemaps, retries up to 3 times). The `NAME` var now comes from `wrangler.jsonc` instead of a `--var` flag.
