---
'@repo/wrangler-config': patch
'example-worker-echoback': patch
---

fix: remove `dependencies_instrumentation` from the default Wrangler config. The wrangler version bundled with @cloudflare/vitest-pool-workers does not recognize the field yet, causing a warning on every test run
