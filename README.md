# Workers Monorepo Template

This template provides a fully featured monorepo for managing multiple Cloudflare Workers.

## Why a Monorepo?

Managing multiple related services (like Cloudflare Workers) in separate repositories can become complex. A monorepo approach offers several advantages:

- **Simplified dependency management** - `pnpm workspaces` allow you to manage dependencies across all your workers and shared packages from a single place. The tool `syncpack` (configured via `.syncpackrc.cjs`) help keep versions consistent.
- **Code sharing and reuse** - Easily create and share common logic, types, and utilities between workers by placing them in the `packages/` directory. Changes to shared code are immediately available to all consumers.
- **Atomic commits** - Changes affecting multiple workers or shared libraries can be committed together, making the history easier to understand and reducing the risk of inconsistencies.
- **Consistent tooling** - Apply the same build, test, linting, and formatting configurations (e.g., via Turborepo in `turbo.json` and shared configs in `packages/`) across all projects, ensuring consistent tooling and code quality across Workers.
- **Streamlined CI/CD** - A single pipeline (like the ones in `.github/workflows/`) can build, test, and deploy all Workers, simplifying the release process.
- **Easier refactoring** - Refactoring code that spans multiple workers or shared packages is significantly easier within a single repository.

## Quick Start

You can bootstrap a new monorepo using this template by running:

```bash
npm create workers-monorepo@latest
```

## Prerequisites

- Node.js v22 or later
- pnpm v10 or later

## Getting Started

**Install Dependencies:**

```bash
just install
```

**Run Development Server:**

```bash
just dev
```

**Create a New Worker:**

Use the built-in generator to scaffold a new Cloudflare Workers application:

```bash
just new-worker
```

This will guide you throught he setup process of creating a new application within the `apps/` directory.

**Deploy all Workers:**

```bash
just deploy
```

Note: This will also deploy the example application in `apps/example-worker-echoback`. If you don't want to deploy that Worker, simply remove the deploy script from [apps/example/workers/echoback/package.json](apps/example-worker-echoback/package.json).

## Repository Structure

This monorepo is organized as follows:

- `apps/` - Contains individual Cloudflare Worker applications. Each subdirectory is typically a deployable unit.
  - `example-worker-echoback` - An example worker demonstrating basic functionality.
- `packages/` - Shared libraries, utilities, and configurations used across multiple applications.
- `packages/tools/` - A package containing various scripts and a CLI for developing the monorepo.
  - Each Workers application's package.json scripts point to scripts within `packages/tools/bin/`. This makes it easier to keep scripts consistent across Workers.
- `turbo/` - Contains `turbo gen` templates
  - `fetch-worker`: A basic Cloudflare Worker template.
  - `fetch-worker-vite`: A Cloudflare Worker template using Vite for bundling and development.
- `Justfile` - Defines convenient aliases for common development tasks.
- `pnpm-workspace.yaml` - Defines the pnpm workspace structure.
- `turbo.json` - Configures Turborepo build and task execution.
- `.syncpackrc.cjs` - Configures `syncpack` for managing and synchronizing dependency versions across packages in the monorepo.
  - The included configuration ensures that dependencies are all kept in sync and use a pinned version so that we can choose when to update dependencies.

## Available Commands

This repository uses a `Justfile` to provide easy access to common commands. You can explore all available commands by running `just --list`.

Here are some key commands:

- `just` - Show a list of available scripts.
- `just install` - Install all dependencies.
- `just dev` - Start the development server for all workers.
- `just build` - Build all workers.
- `just test` - Run tests for all workers.
- `just check` - Run linting, type checking, and formatting checks.
- `just fix` - Automatically fix linting and formatting issues.
- `just deploy` - Deploy workers (requires configuration).
- `just cs` - Create a new changeset for versioning.
- `just update-deps` - Update dependencies across the monorepo.
- `just new-worker` - Generate a new worker service using the template.
- `just new-package` - Generate a new package for sharing code between other apps/packages.

For a complete list of available commands, run `just` or see the [Justfile](./Justfile) for more details.

## GitHub Actions

This repository includes GitHub Actions workflows defined in the `.github/workflows` directory:

- **`branches.yml` (Branches Workflow):**
  - Triggered on pushes to any branch _except_ `main`.
  - Installs dependencies.
  - Runs checks/tests (`pnpm turbo check:ci`)

- **`release.yml` (Release Workflow):**
  - Triggered on pushes to the `main` branch.
  - Contains two jobs:
    - `test-and-deploy`: Installs dependencies, runs checks, tests, and then deploys all workers (`pnpm turbo deploy`). This step requires the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets to be configured in your repository's GitHub secrets.
    - `create-release-pr`: Uses [Changesets](https://github.com/changesets/changesets) to create a pull request that compiles changelogs and bumps package versions. This PR is primarily for documentation and versioning, as deployment happens directly on merge to `main`.
