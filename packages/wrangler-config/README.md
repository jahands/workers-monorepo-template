# @repo/wrangler-config

`wrangler-config` lets you author your Wrangler configuration in TypeScript via `wrangler.config.ts` instead of `wrangler.jsonc`.

It does this by generating `wrangler.jsonc` from `wrangler.config.ts` via `wrangler-config`.

## Why use `wrangler.config.ts`?

Advanced configuration can be easier to express in TypeScript when you want to compute values or share helpers.

## Workspace usage

This package is internal to this monorepo. Add it as a workspace dependency and import from `@repo/wrangler-config`.

`wrangler-config` does not search upward. Run it from the same directory as your `wrangler.config.ts`.

## Create `wrangler.config.ts`

```ts
// wrangler.config.ts
import { defineConfig } from '@repo/wrangler-config'

export default defineConfig(async (c) => ({
  ...c.defaults,
  name: 'my-worker',
  main: 'src/index.ts',
  compatibility_date: '2025-01-01',
  compatibility_flags: ['nodejs_compat'],
  vars: {
    ENVIRONMENT: 'development',
  },
}))
```

`c` comes from the package-level `wranglerContext` in `src/wrangler.defaults.ts`, so shared defaults can be maintained in one place.

## Keep `wrangler.jsonc` up to date

Add a `build:wrangler-config` script and run it when you change `wrangler.config.ts`:

```json
{
  "scripts": {
    "build:wrangler-config": "wrangler-config"
  }
}
```

Commit both `wrangler.config.ts` and the generated `wrangler.jsonc`. `wrangler.jsonc` remains what Wrangler consumes.

## CLI commands

Run the CLI with `wrangler-config` from package scripts.

Available commands:

- `wrangler-config`: Generates `wrangler.jsonc` locally, or runs `check` when the `CI` environment variable is truthy.
- `wrangler-config generate`: Regenerates `wrangler.jsonc` from `wrangler.config.ts`.
- `wrangler-config check`: Validates that `wrangler.config.ts` matches the existing `wrangler.jsonc`; exits with an error if they differ.

Pair `check` with CI to guarantee committed `wrangler.jsonc` stays aligned with your source configuration.

## Updating the schema

`src/schema.ts` is generated from `node_modules/wrangler/config-schema.json`. After updating the `wrangler` dependency, regenerate it with:

```sh
pnpm -F @repo/wrangler-config update-schema
```
