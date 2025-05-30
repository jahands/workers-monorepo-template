---
trigger: manual
description:
globs:
---

# Development Workflow

This guide covers the common development workflows and commands for working with the Workers monorepo.

## Prerequisites

- Node.js v22 or later
- pnpm v10 or later

## Getting Started

### Initial Setup

```bash
# Install all dependencies
just install
# or
pnpm install
```

### Development Commands

All commands can be run using either the [Justfile](mdc:Justfile) shortcuts or direct pnpm/turbo commands:

#### Start Development

```bash
# Start dev servers for all workers
just dev
# or
pnpm run dev
```

#### Create New Worker

```bash
# Interactive generator for new worker
just new-worker
# Uses templates from turbo/generators/templates/
```

#### Create New Package

```bash
# Generate shared package
just new-package
```

#### Build & Test

```bash
# Build all projects
just build
# or
pnpm turbo build

# Run tests
just test
# or
pnpm test

# Run CI checks (linting, types, formatting)
just check
# or
pnpm run check
```

#### Code Quality

```bash
# Auto-fix issues
just fix
# or
pnpm run fix

# Check code formatting
pnpm run check:format

# Fix formatting
pnpm run fix:format
```

#### Deployment

```bash
# Deploy all workers
just deploy
# Requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
```

## Workspace Commands

### Working with Specific Packages

**Use Turborepo filters for build/test/deploy tasks, pnpm filters for dependency management:**

```bash
# Run command in specific workspace using turbo
pnpm turbo -F @repo/package-name build

# Run command in all worker apps
pnpm turbo -F "./apps/*" dev

# Add dependency to specific package (use pnpm for dependency management)
pnpm -F @repo/package-name add dependency-name
```

### Turborepo Commands

```bash
# Build with dependency graph
pnpm turbo build

# Run checks across all packages
pnpm turbo check

# Clear turbo cache
pnpm turbo clean
```

## Key Files to Know

- [package.json](mdc:package.json) - Root scripts and workspace configuration
- [turbo.json](mdc:turbo.json) - Build pipeline and task dependencies
- [Justfile](mdc:Justfile) - Convenient command shortcuts
- [.syncpackrc.cjs](mdc:.syncpackrc.cjs) - Dependency management rules

## Dependency Management

This project uses:

- **pnpm workspaces** for package linking
- **syncpack** for version consistency
- **Turborepo** for build orchestration

Always use `pnpm` instead of `npm` or `yarn` to maintain workspace consistency.

## Command Guidelines

- **Use `pnpm turbo -F <package>`** for build, test, and deploy tasks
- **Use `pnpm -F <package>`** for dependency management (add/remove packages)
- **Use `just <command>`** for common development tasks (shortcuts to turbo commands)

## Code Style Guidelines

- **Tabs**: Use tabs for indentation, spaces for alignment
- **Imports**: Type imports use `import type`, workspace imports via `@repo/`
- **Import order**: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- **Variables**: Prefix unused with `_`, prefer `const` over `let`
- **Types**: Use `array-simple` notation, explicit function return types optional
- **Framework**: Hono for workers, Vitest with `@cloudflare/vitest-pool-workers` for testing
- **Config**: Use `wrangler.jsonc`, place integration tests in `src/test/integration/`

## Important Notes

- **TypeScript Configs**: When extending configs, always use fully qualified paths (e.g., `@repo/typescript-config/base.json`) instead of relative paths
- **Worker Types**: Don't add 'WebWorker' to TypeScript config for Workers - these types are included in worker-configuration.d.ts or @cloudflare/workers-types
- **Lint Checking**: First `cd` to the package directory, then run: `pnpm turbo check:types check:lint`
- **Dependencies**: Use `workspace:*` protocol for internal dependencies
