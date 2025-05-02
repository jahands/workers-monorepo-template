# Workers Monorepo Template

This template provides a structured starting point for managing multiple Cloudflare Workers within a single monorepo. It leverages pnpm workspaces, Turborepo for build orchestration, and a Justfile for convenient command execution.

## Getting Started

**Install Dependencies:**

```bash
just install
# or
pnpm install
```

**Run Development Server:**

```bash
just dev
# or
pnpm run dev
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
# or
pnpm turbo deploy
```

Note: This will also deploy the example application in `apps/example-worker-echoback`. If you don't want to deploy that Worker, simply remove the deploy script from [apps/example/workers/echoback/package.json](apps/example-worker-echoback/package.json).

## Repository Structure

This monorepo is organized as follows:

- `apps/`: Contains individual Cloudflare Worker applications. Each subdirectory is typically a deployable unit.
  - `example-worker-echoback`: An example worker demonstrating basic functionality.
- `packages/`: Shared libraries, utilities, and configurations used across multiple applications.
- `packages/tools/`: A package containing various scripts and a CLI for developing the monorepo.
  - Each Workers application's package.json scripts point to scripts within `packages/tools/bin/`. This makes it easier to keep scripts consistent across Workers.
- `turbo/`: Contains `turbo gen` templates
- `Justfile`: Defines convenient aliases for common development tasks.
- `pnpm-workspace.yaml`: Defines the pnpm workspace structure.
- `turbo.json`: Configures Turborepo build and task execution.

## Available Commands

This repository uses a `Justfile` to provide easy access to common commands. You can explore all available commands by running `just --list`.

Here are some key commands:

- `just`: Show a list of available scripts.
- `just install`: Install all dependencies.
- `just dev`: Start the development server for all workers.
- `just build`: Build all workers.
- `just test`: Run tests for all workers.
- `just check`: Run linting, type checking, and formatting checks.
- `just fix`: Automatically fix linting and formatting issues.
- `just deploy`: Deploy workers (requires configuration).
- `just cs`: Create a new changeset for versioning.
- `just update-deps`: Update dependencies across the monorepo.
- `just new-worker` (or `just gen`): Generate a new worker service using the template.

You can also run most commands directly using `pnpm` and `turbo` if you prefer (e.g., `pnpm install`, `pnpm turbo build`). See the `Justfile` and `package.json` files for more details.
