# Workers Monorepo

- Use `bun turbo <command>` for validation.
  - For individual packages, run the command within the package directory.
  - For multiple packages, use `bun turbo -F <package name> -F <package name 2> <command>` and run from root (get the package name from package.json).
  - For multiple checks, use a single command, not multiple: `bun turbo -F <package name> build check:types check:lint`
  - `just lint` runs `check:lint` + `check:types` across the repo with grouped logs and `--continue` (agent-friendly).
  - Common commands: `check` (run all checks), `check:types`, `check:lint`.
  - For the full list of tasks, see turbo.config.ts (turbo.json is generated from it - run `just generate-turbo-config` after editing).
  - NEVER run a dev server (e.g. `bun run dev`, `just dev`).
- Do not worry about formatting while making edits. When you're done, run `just fix --format`.
- Use `pnpm install` without any filters to install updated dependencies. NEVER use `--filter` with `pnpm install`.
- ALWAYS use rg/fd tools via Bash tool (NEVER use glob/grep tools).
- NEVER name variables `error` - either use `err` or `e`.
- ALWAYS look for local patterns and follow them unless otherwise instructed - consistency is important for maintainability.
- I often stage changes as you're working (and sometimes commit them).
- Follow existing patterns for commit messages and PR titles.
  - Every change that affects a workspace package MUST contain a changeset (using consistent pattern).
- DO NOT create helper functions because you think "maybe it will be useful later". That is a bad reason to make something a helper.

## Layout

- `apps/` - Cloudflare Workers. Each has `src/context.ts` for typed bindings and a `wrangler.config.ts` (`wrangler.jsonc` is generated from it by `@repo/wrangler-config` - never edit it by hand).
- `packages/` - shared code: `@repo/hono-helpers`, `@repo/test-helpers`, `@repo/tools` (the `runx` CLI), `@repo/wrangler-config`, plus shared `oxlint`/`typescript`/dependency configs.
- `turbo/generators/` - `just new-worker` (fetch, vite, minimal, workflows) and `just new-package` templates.
- Internal deps use `workspace:*`. TypeScript configs extend fully qualified paths (`@repo/typescript-config/base.json`).
- Tests use vitest with `@cloudflare/vitest-pool-workers`; run a single file with `bun vitest path/to/file.test.ts`.
