---
trigger: manual
description:
globs:
---

# Workers Monorepo Template - Project Structure

This is a Cloudflare Workers monorepo template built with Turborepo, pnpm workspaces, and modern tooling.

## Repository Layout

### Core Directories

- **`apps/`** - Individual Cloudflare Worker applications (deployable units)

  - Each subdirectory is a separate worker project
  - Example: [apps/example-worker-echoback/](mdc:apps/example-worker-echoback/) - demonstrates basic worker functionality

- **`packages/`** - Shared libraries, utilities, and configurations
  - [packages/eslint-config/](mdc:packages/eslint-config/) - Shared ESLint configuration
  - [packages/typescript-config/](mdc:packages/typescript-config/) - Shared TypeScript configuration
  - [packages/hono-helpers/](mdc:packages/hono-helpers/) - Hono framework utilities and middleware
  - [packages/tools/](mdc:packages/tools/) - CLI tools and development scripts
  - [packages/workspace-dependencies/](mdc:packages/workspace-dependencies/) - Shared dependencies management

### Configuration Files

- [package.json](mdc:package.json) - Root package with workspace scripts and dev dependencies
- [pnpm-workspace.yaml](mdc:pnpm-workspace.yaml) - Defines pnpm workspace structure
- [turbo.json](mdc:turbo.json) - Turborepo configuration for builds, tasks, and caching
- [Justfile](mdc:Justfile) - Convenient command aliases for development
- [tsconfig.json](mdc:tsconfig.json) - Root TypeScript configuration
- [.syncpackrc.cjs](mdc:.syncpackrc.cjs) - Dependency version synchronization

### Code Generation

- **`turbo/generators/`** - Turbo gen templates for scaffolding
  - `templates/fetch-worker/` - Basic Cloudflare Worker template
  - `templates/fetch-worker-vite/` - Worker template with Vite bundling
  - `templates/package/` - Shared package template

### Build & Development

- **`.turbo/`** - Turborepo cache and daemon files
- **`node_modules/`** - Workspace dependencies (managed by pnpm)
- **`.github/workflows/`** - CI/CD pipelines for testing and deployment

## Key Concepts

- **Monorepo Benefits**: Shared dependencies, atomic commits, consistent tooling, easier refactoring
- **pnpm Workspaces**: Efficient dependency management across packages
- **Turborepo**: Build orchestration with intelligent caching and parallelization
- **Code Generation**: Use `just new-worker` to scaffold new workers from templates
