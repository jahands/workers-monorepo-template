---
'@repo/tools': minor
'@repo/turbo-generators': patch
'example-worker-echoback': patch
---

feat: move wrangler build/dev/deploy into runx

Replaces the `run-wrangler-build`/`run-wrangler-dev`/`run-wrangler-deploy` shell bins with `runx build wrangler`, `runx dev wrangler`, and `runx deploy wrangler`.

- `build` runs `wrangler deploy --dry-run` with `--minify --outdir ./dist` and reports how long it took
- `dev` builds workspace deps and copies `.dev.vars.example` to `.dev.vars` first, so apps and worker templates now ship a `.dev.vars.example`
- `deploy` derives `RELEASE` from the package version and short git SHA, sets `ENVIRONMENT`, uploads source maps, and retries up to 3 times. `NAME` now comes from `wrangler.jsonc` vars instead of a `--var` flag.
