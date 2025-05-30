# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Essential Commands

```bash
# Install dependencies
just install
# or
pnpm install --child-concurrency=10

# Run development servers for all workers
just dev
# or
pnpm run dev

# Run tests
just test
# or
pnpm vitest

# Run a single test file
pnpm vitest path/to/test.test.ts

# Build all workers
just build
# or
pnpm turbo build

# Check code quality (lint, types, format)
just check
# or
pnpm runx check

# Fix code issues automatically
just fix
# or
pnpm runx fix

# Deploy all workers (requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID)
just deploy
# or
pnpm turbo deploy
```

### Creating New Components

```bash
# Create a new Cloudflare Worker
just new-worker

# Create a new shared package
just new-package
```

### Dependency Management

```bash
# Update dependencies across the monorepo
just update-deps

# Create a changeset for versioning
just cs
```

## High-Level Architecture

This is a **Cloudflare Workers monorepo** using pnpm workspaces and Turborepo for orchestration. The architecture enables multiple Workers to share code and tooling while maintaining independent deployment capabilities.

### Key Architectural Decisions

1. **Script Centralization**: All package.json scripts in worker apps delegate to commands in `@repo/tools` (e.g., `run-wrangler-dev`, `run-eslint`). This ensures consistency across workers and simplifies maintenance.

2. **Shared Configuration**: TypeScript, ESLint, and other tool configurations are centralized in the `packages/` directory and referenced by workers, avoiding duplication. When TypeScript configs in `@packages/typescript-config/` extend other configs, they must use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths (e.g., `./base.json`) to prevent resolution issues.

3. **Hono Framework**: Workers use Hono as the web framework, with shared middleware and helpers in `@repo/hono-helpers` for common patterns like error handling, logging, and CORS.

4. **Testing Strategy**: Vitest with the Cloudflare Workers test pool (`@cloudflare/vitest-pool-workers`) enables testing Workers in an environment that closely matches production.

5. **Dependency Synchronization**: Syncpack ensures all shared dependencies use the same version across the monorepo, with pinned versions for predictable builds.

6. **Task Orchestration**: Turborepo defines task dependencies in `turbo.json`, enabling parallel execution where possible and caching for improved performance.

### Worker Development Patterns

- Workers are configured via `wrangler.jsonc` with environment variables like `ENVIRONMENT` and `SENTRY_RELEASE` that are overridden during deployment
- Each worker has a `context.ts` file that provides typed access to environment bindings
- Integration tests are placed in `src/test/integration/` and test actual HTTP endpoints
- Workers use the `nodejs_compat` compatibility flag for broader Node.js API support

### Deployment Flow

1. GitHub Actions run on push to branches (tests only) and main (tests + deploy)
2. The release workflow uses Changesets to manage versions and changelogs
3. Deployment happens automatically on merge to main, not from PR branches
4. Each worker can be deployed independently using its `deploy` script

## Code Style Guidelines

- **Tabs**: Use tabs for indentation, spaces for alignment
- **Imports**: Type imports use `import type`, workspace imports via `@repo/`
- **Import order**: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- **Variables**: Prefix unused with `_`, prefer `const` over `let`
- **Types**: Use `array-simple` notation, explicit function return types optional

## Important Notes & Memories

- **TypeScript Configs**: When extending configs, always use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths (e.g., `./base.json`)
- **Worker Types**: Don't add 'WebWorker' to TypeScript config for Workers - these types are already included in worker-configuration.d.ts or @cloudflare/workers-types
- **Lint Checking**: First `cd` to the package directory containing the file you're working on, then run: `pnpm turbo check:types check:lint`
- **Dependencies**: Use `workspace:*` protocol for internal dependencies
- **Commands**: Use `pnpm turbo -F` for build/test/deploy tasks, `pnpm -F` for dependency management
