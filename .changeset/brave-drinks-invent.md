---
'@repo/wrangler-config': minor
'example-worker-echoback': patch
---

feat: add @repo/wrangler-config for authoring Wrangler config in TypeScript

Adds a new `@repo/wrangler-config` package with a `defineConfig()` API and a `wrangler-config` CLI that generates `wrangler.jsonc` from `wrangler.config.ts` (and checks for drift in CI). The example worker and the worker generators now author their Wrangler config via `wrangler.config.ts`.
