---
trigger: manual
description:
globs:
---

# Cloudflare Worker Development Guide

This guide covers patterns and best practices for developing Cloudflare Workers within this monorepo.

## Worker Architecture

### Example Worker Structure

Reference [apps/example-worker-echoback/](mdc:apps/example-worker-echoback/) for the standard worker structure:

```
apps/worker-name/
├── src/
│   ├── index.ts          # Main worker entry point
│   └── test/
│       └── integration/  # Integration tests
├── package.json          # Worker-specific dependencies
├── wrangler.jsonc        # Cloudflare configuration
└── vitest.config.ts      # Test configuration
```

## Creating New Workers

### Using the Generator

```bash
# Interactive worker creation
just new-worker

# Choose from templates:
# - fetch-worker: Basic HTTP worker
# - fetch-worker-vite: Worker with Vite bundling
```

### Templates Available

- **`turbo/generators/templates/fetch-worker/`** - Standard worker template
- **`turbo/generators/templates/fetch-worker-vite/`** - Worker with Vite for advanced bundling

## Shared Packages for Workers

### Hono Helpers

[packages/hono-helpers/](mdc:packages/hono-helpers/) provides:

- Common middleware for Hono framework
- HTTP utilities and helpers
- Shared request/response patterns

### Usage Example

```typescript
import { Hono } from 'hono'

import { cors, logger } from '@repo/hono-helpers'

const app = new Hono()
app.use('*', cors(), logger())
```

### Tools Package

[packages/tools/](mdc:packages/tools/) contains:

- Development scripts shared across workers
- CLI utilities for the monorepo
- Build and deployment helpers

## Worker Configuration

### wrangler.jsonc Pattern

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "worker-name",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-28",
  "compatibility_flags": ["nodejs_compat"],
  "routes": [],
  "logpush": true,
  "observability": {
    "enabled": true,
  },
  "vars": {
    "ENVIRONMENT": "development", // overridden during deployment
    "SENTRY_RELEASE": "unknown", // overridden during deployment
  },
}
```

### Environment Variables

- Use `.dev.vars` for local development secrets
- Configure production variables in Cloudflare dashboard
- Reference in [turbo.json](mdc:turbo.json) globalDependencies for cache invalidation
- Use `wrangler.jsonc` for JSON format with comments support

## Testing Workers

### Integration Tests

```typescript
// src/test/integration/worker.test.ts
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

import worker from '../../index'

describe('Worker', () => {
  it('responds with expected output', async () => {
    const request = new Request('http://example.com/')
    const ctx = createExecutionContext()
    const response = await worker.fetch(request, env, ctx)
    await waitOnExecutionContext(ctx)

    expect(response.status).toBe(200)
  })
})
```

### Test Commands

```bash
# Run all tests
just test

# Run tests for specific worker
pnpm -F worker-name test

# Run integration tests only
pnpm turbo test:integration
```

## Development Workflow

### Local Development

```bash
# Start all workers in dev mode
just dev

# Start specific worker
pnpm turbo -F worker-name dev
```

### Build Process

Turborepo handles the build pipeline as defined in [turbo.json](mdc:turbo.json):

1. Build shared packages first (`^build` dependency)
2. Build workers that depend on shared packages
3. Generate deployment artifacts

### Deployment

```bash
# Deploy all workers
just deploy

# Deploy specific worker
pnpm turbo -F worker-name deploy
```

## Best Practices

1. **Use Shared Packages**: Leverage [packages/hono-helpers/](mdc:packages/hono-helpers/) for common functionality
2. **Follow Naming**: Use consistent naming for workers and environments
3. **Environment Separation**: Use different worker names for dev/staging/prod
4. **Type Safety**: Leverage TypeScript and shared types from packages
5. **Testing**: Write integration tests for all HTTP endpoints
6. **Caching**: Turborepo automatically caches builds - keep [turbo.json](mdc:turbo.json) dependencies accurate
