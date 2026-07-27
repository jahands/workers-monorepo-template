---
'example-worker-echoback': patch
---

fix: validate JSON responses with zod in tests instead of type casts

Casting `res.json()` to a type asserts a shape the test never checked. The example worker's integration tests now parse responses with zod.
