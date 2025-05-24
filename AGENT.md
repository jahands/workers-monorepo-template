# AGENT.md

This file provides guidance to AI agents when working with this Cloudflare Workers monorepo.

## Commands

```bash
# Install dependencies
just install

# Development
pnpm turbo -F worker-name dev  # Start specific worker

# Testing
just test                   # Run all tests
pnpm vitest path/to/test.test.ts  # Run single test file
pnpm turbo -F worker-name test    # Test specific worker
pnpm -F worker-name test --watch  # Watch mode

# Build & Quality
just build                  # Build all
just check                  # Lint, types, format
just fix                    # Auto-fix issues

# Create components
just new-worker            # Create new worker
just new-package           # Create shared package
```

## Code Style

- **Tabs**: Use tabs for indentation, spaces for alignment
- **Imports**: Type imports use `import type`, workspace imports via `@repo/`
- **Import order**: Built-ins → Third-party → `@repo/` → Relative (enforced by Prettier)
- **Variables**: Prefix unused with `_`, prefer `const` over `let`
- **Types**: Use `array-simple` notation, explicit function return types optional
- **Framework**: Hono for workers, Vitest with `@cloudflare/vitest-pool-workers` for testing
- **Config**: Use `wrangler.jsonc`, place integration tests in `src/test/integration/`
