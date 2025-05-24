# AGENT.md

This file provides guidance to AI agents when working with this Cloudflare Workers monorepo.

## Commands

```bash
# Install dependencies
just install

# Development
just dev                        # Start all workers
pnpm turbo -F worker-name dev  # Start specific worker

# Testing
just test                      # Run all tests
pnpm vitest path/to/test.test.ts  # Run single test file
pnpm turbo -F worker-name test    # Test specific worker
pnpm -F worker-name test --watch  # Watch mode

# Build & Quality
just build                     # Build all
just check                     # Lint, types, format
just fix                       # Auto-fix issues

# Create components
just new-worker                # Create new worker
just new-package               # Create shared package

# Deployment
just deploy                    # Deploy all workers (requires Cloudflare secrets)
pnpm turbo -F worker-name deploy  # Deploy specific worker

# Dependency Management
pnpm -F @repo/package-name add dependency  # Add to specific package
just update-deps              # Update all dependencies
just cs                       # Create changeset
```

## Architecture Overview

This is a **Cloudflare Workers monorepo** using pnpm workspaces and Turborepo:

- **`apps/`** - Individual Cloudflare Worker applications
- **`packages/`** - Shared libraries and configurations
  - `@repo/eslint-config` - Shared ESLint configuration
  - `@repo/typescript-config` - Shared TypeScript configuration
  - `@repo/hono-helpers` - Hono framework utilities
  - `@repo/tools` - Development tools and scripts

## Code Style

- **Tabs**: Use tabs for indentation, spaces for alignment
- **Imports**: Type imports use `import type`, workspace imports via `@repo/`
- **Import order**: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- **Variables**: Prefix unused with `_`, prefer `const` over `let`
- **Types**: Use `array-simple` notation, explicit function return types optional
- **Framework**: Hono for workers, Vitest with `@cloudflare/vitest-pool-workers` for testing
- **Config**: Use `wrangler.jsonc`, place integration tests in `src/test/integration/`

## Important Notes

- **TypeScript Configs**: When extending configs, use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths
- **Worker Types**: Don't add 'WebWorker' to TypeScript config - these types are included in `worker-configuration.d.ts` or `@cloudflare/workers-types`
- **Lint Checking**: First `cd` to the package directory, then run: `pnpm turbo check:types check:lint`
- **Dependencies**: Use `workspace:*` protocol for internal dependencies
- **Commands**: Use `pnpm turbo -F` for build/test/deploy tasks, `pnpm -F` for dependency management
