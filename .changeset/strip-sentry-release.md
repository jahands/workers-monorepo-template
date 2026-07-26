---
'@repo/hono-helpers': minor
'example-worker-echoback': patch
'@repo/turbo-generators': patch
'@repo/tools': patch
---

fix: rename `SENTRY_RELEASE` env var to `RELEASE`

Removes leftover Sentry references: `SharedHonoEnv` now declares `RELEASE`, deploys pass `--var RELEASE:<version>`, and the example worker plus all worker generator templates use the new var name.
