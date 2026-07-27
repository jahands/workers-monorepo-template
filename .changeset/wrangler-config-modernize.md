---
'@repo/turbo-generators': minor
'example-worker-echoback': minor
---

feat: modernize wrangler.jsonc for apps and worker templates

Bumps `compatibility_date` to 2026-06-04 and adds `workers_dev: false`, `preview_urls: false`, `placement: { mode: "smart" }`, and a `CF_VERSION_METADATA` binding. `NAME` is now declared in `vars` instead of being passed at deploy time.

Note that smart placement changes where a Worker runs, and `workers_dev: false` disables the `.workers.dev` URL.
