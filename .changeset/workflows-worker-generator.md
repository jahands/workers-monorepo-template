---
'@repo/turbo-generators': minor
---

feat: add `workflows-worker` generator

Scaffolds a Cloudflare Workflows Worker: a `WorkflowEntrypoint` with zod-parsed params and tagged logging, a Hono app with routes to create instances and inspect instance status, integration tests, and a `wrangler.jsonc` with a workflows binding.

Worker generators now run `fix:workers-types` before linting, so a freshly scaffolded Worker passes checks without a committed `worker-configuration.d.ts` placeholder.
