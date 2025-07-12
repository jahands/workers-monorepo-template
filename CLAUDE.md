<cloudflare-workers-monorepo>

<title>Cloudflare Workers Monorepo Development Guidelines</title>

<description>This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.</description>

<common-development-commands>

<essential-commands>
<command-group name="installation">
- `just install` - Install dependencies
- `pnpm install --child-concurrency=10` - Alternative install with concurrency limit
</command-group>

<command-group name="development">
- `just dev` - Run development servers for all workers
- `pnpm run dev` - Alternative dev command
</command-group>

<command-group name="testing">
- `just test` - Run all tests
- `pnpm vitest` - Alternative test command
- `pnpm vitest path/to/test.test.ts` - Run a single test file
</command-group>

<command-group name="building">
- `just build` - Build all workers
- `pnpm turbo build` - Alternative build command
</command-group>

<command-group name="code-quality">
- `just check` - Check code quality (lint, types, format)
- `pnpm runx check` - Alternative check command
- `just fix` - Fix code issues automatically
- `pnpm runx fix` - Alternative fix command
</command-group>

<command-group name="deployment">
- `just deploy` - Deploy all workers (requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID)
- `pnpm turbo deploy` - Alternative deploy command
</command-group>
</essential-commands>

<component-creation>
- `just new-worker` - Create a new Cloudflare Worker
- `just new-package` - Create a new shared package
</component-creation>

<dependency-management>
- `just update-deps` - Update dependencies across the monorepo
- `just cs` - Create a changeset for versioning
</dependency-management>
</common-development-commands>

<high-level-architecture>

<overview>This is a Cloudflare Workers monorepo using pnpm workspaces and Turborepo for orchestration. The architecture enables multiple Workers to share code and tooling while maintaining independent deployment capabilities.</overview>

<key-architectural-decisions>
<decision>
<name>Script Centralization</name>
<description>All package.json scripts in worker apps delegate to commands in `@repo/tools` (e.g., `run-wrangler-dev`, `run-eslint`). This ensures consistency across workers and simplifies maintenance.</description>
</decision>

<decision>
<name>Shared Configuration</name>
<description>TypeScript, ESLint, and other tool configurations are centralized in the `packages/` directory and referenced by workers, avoiding duplication. When TypeScript configs in `@packages/typescript-config/` extend other configs, they must use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths (e.g., `./base.json`) to prevent resolution issues.</description>
</decision>

<decision>
<name>Hono Framework</name>
<description>Workers use Hono as the web framework, with shared middleware and helpers in `@repo/hono-helpers` for common patterns like error handling, logging, and CORS.</description>
</decision>

<decision>
<name>Testing Strategy</name>
<description>Vitest with the Cloudflare Workers test pool (`@cloudflare/vitest-pool-workers`) enables testing Workers in an environment that closely matches production.</description>
</decision>

<decision>
<name>Dependency Synchronization</name>
<description>Syncpack ensures all shared dependencies use the same version across the monorepo, with pinned versions for predictable builds.</description>
</decision>

<decision>
<name>Task Orchestration</name>
<description>Turborepo defines task dependencies in `turbo.json`, enabling parallel execution where possible and caching for improved performance.</description>
</decision>
</key-architectural-decisions>

<worker-development-patterns>
- Workers are configured via `wrangler.jsonc` with environment variables like `ENVIRONMENT` and `SENTRY_RELEASE` that are overridden during deployment
- Each worker has a `context.ts` file that provides typed access to environment bindings
- Integration tests are placed in `src/test/integration/` and test actual HTTP endpoints
- Workers use the `nodejs_compat` compatibility flag for broader Node.js API support
</worker-development-patterns>

<deployment-flow>
- GitHub Actions run on push to branches (tests only) and main (tests + deploy)
- The release workflow uses Changesets to manage versions and changelogs
- Deployment happens automatically on merge to main, not from PR branches
- Each worker can be deployed independently using its `deploy` script
</deployment-flow>
</high-level-architecture>

<code-style-guidelines>
- Use tabs for indentation, spaces for alignment
- Type imports use `import type`, workspace imports via `@repo/`
- Import order: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- Prefix unused variables with `_`, prefer `const` over `let`
- Use `array-simple` notation, explicit function return types optional
</code-style-guidelines>

<important-notes>
- When extending TypeScript configs, always use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths (e.g., `./base.json`)
- Don't add 'WebWorker' to TypeScript config for Workers - these types are already included in worker-configuration.d.ts or @cloudflare/workers-types
- For lint checking: First `cd` to the package directory containing the file you're working on, then run: `pnpm turbo check:types check:lint`
- Use `workspace:*` protocol for internal dependencies
- Use `pnpm turbo -F` for build/test/deploy tasks, `pnpm -F` for dependency management
</important-notes>

<important-instruction-reminders>
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User
</important-instruction-reminders>

</cloudflare-workers-monorepo>