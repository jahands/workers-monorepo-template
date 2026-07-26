---
'@repo/turbo-generators': minor
---

feat: add `workflows-worker` generator

Scaffolds a Cloudflare Workflows Worker: a zod-validated WorkflowEntrypoint, a Hono app with routes to create instances and inspect instance status, integration tests, and a `wrangler.jsonc` with a workflows binding. Worker types are now generated before linting in the post-generation fix step so freshly scaffolded workers pass lint without a committed worker-configuration.d.ts placeholder.
