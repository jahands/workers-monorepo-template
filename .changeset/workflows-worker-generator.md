---
'@repo/turbo-generators': minor
---

feat: add `workflows-worker` generator that scaffolds a Cloudflare Workflows Worker: a zod-validated WorkflowEntrypoint, a Hono app with routes to create instances and inspect instance status, integration tests, and a wrangler.config.ts with a workflows binding. Also generate worker types before linting in the post-generation fix step so freshly scaffolded workers pass lint without a committed worker-configuration.d.ts placeholder
