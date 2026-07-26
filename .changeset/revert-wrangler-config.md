---
'example-worker-echoback': patch
'@repo/turbo-generators': patch
---

chore: author Wrangler config directly in `wrangler.jsonc`

Removes the `@repo/wrangler-config` package and `wrangler.config.ts` indirection. Apps and generator templates now keep their config in a plain `wrangler.jsonc`, which is simpler for most users.
