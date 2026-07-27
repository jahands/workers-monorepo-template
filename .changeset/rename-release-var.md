---
'@repo/hono-helpers': minor
'@repo/turbo-generators': patch
'example-worker-echoback': patch
'@repo/tools': patch
---

fix: rename `SENTRY_RELEASE` env var to `RELEASE`

Sentry was never wired up, so the name was misleading. `SharedHonoEnv` now declares `RELEASE`, `runx deploy wrangler` passes `--var RELEASE:<version>`, and the example worker plus all worker templates use the new name. The `// TODO: Capture to Sentry` markers in `withOnError` are still there if you do want Sentry.
