<cloudflare-workers-agent-guide>

<title>AI Agent Guidelines for Cloudflare Workers Monorepo</title>

<description>This file provides guidance to AI agents when working with this Cloudflare Workers monorepo.</description>

<commands>
<command-group name="installation">
- `just install` - Install dependencies
</command-group>

<command-group name="development">
- `just dev` - Start all workers
- `pnpm turbo -F worker-name dev` - Start specific worker
</command-group>

<command-group name="testing">
- `just test` - Run all tests
- `pnpm vitest path/to/test.test.ts` - Run single test file
- `pnpm turbo -F worker-name test` - Test specific worker
- `pnpm -F worker-name test --watch` - Watch mode
</command-group>

<command-group name="build-and-quality">
- `just build` - Build all
- `just check` - Lint, types, format
- `just fix` - Auto-fix issues
</command-group>

<command-group name="component-creation">
- `just new-worker` - Create new worker
- `just new-package` - Create shared package
</command-group>

<command-group name="deployment">
- `just deploy` - Deploy all workers (requires Cloudflare secrets)
- `pnpm turbo -F worker-name deploy` - Deploy specific worker
</command-group>

<command-group name="dependency-management">
- `pnpm -F @repo/package-name add dependency` - Add to specific package
- `just update-deps` - Update all dependencies
- `just cs` - Create changeset
</command-group>
</commands>

<architecture-overview>
<description>This is a Cloudflare Workers monorepo using pnpm workspaces and Turborepo</description>

<directory-structure>
- `apps/` - Individual Cloudflare Worker applications
- `packages/` - Shared libraries and configurations
  - `@repo/eslint-config` - Shared ESLint configuration
  - `@repo/typescript-config` - Shared TypeScript configuration
  - `@repo/hono-helpers` - Hono framework utilities
  - `@repo/tools` - Development tools and scripts
</directory-structure>
</architecture-overview>

<code-style>
- Use tabs for indentation, spaces for alignment
- Type imports use `import type`, workspace imports via `@repo/`
- Import order: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- Prefix unused variables with `_`, prefer `const` over `let`
- Use `array-simple` notation, explicit function return types optional
- Framework: Hono for workers, Vitest with `@cloudflare/vitest-pool-workers` for testing
- Config: Use `wrangler.jsonc`, place integration tests in `src/test/integration/`
</code-style>

<important-notes>
- When extending TypeScript configs, use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths
- Don't add 'WebWorker' to TypeScript config - these types are included in `worker-configuration.d.ts` or `@cloudflare/workers-types`
- For lint checking: First `cd` to the package directory, then run: `pnpm turbo check:types check:lint`
- Use `workspace:*` protocol for internal dependencies
- Use `pnpm turbo -F` for build/test/deploy tasks, `pnpm -F` for dependency management
</important-notes>

</cloudflare-workers-agent-guide>