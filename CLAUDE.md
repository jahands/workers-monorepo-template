<cloudflare-workers-monorepo>

<title>Cloudflare Workers Monorepo Guidelines for Claude Code</title>

<commands>
- `just install` - Install dependencies
- `just dev` - Run development servers (uses `bun runx dev` - context-aware)
- `just test` - Run tests with vitest (uses `bun vitest`)
- `just build` - Build all workers (uses `bun turbo build`)
- `just check` - Check code quality - deps, lint, types, format (uses `bun runx check`)
- `just fix` - Fix code issues - deps, lint, format, workers-types (uses `bun runx fix`)
- `just deploy` - Deploy all workers (uses `bun turbo deploy`)
- `just preview` - Run Workers in preview mode
- `just new-worker` (alias: `just gen`) - Create a new Cloudflare Worker
- `just new-package` - Create a new shared package
- `just update deps` (alias: `just up deps`) - Update dependencies across the monorepo
- `just update pnpm` - Update pnpm version
- `just update turbo` - Update turbo version
- `just cs` - Create a changeset for versioning
- `bun turbo -F worker-name dev` - Start specific worker
- `bun turbo -F worker-name test` - Test specific worker
- `bun turbo -F worker-name deploy` - Deploy specific worker
- `bun vitest path/to/test.test.ts` - Run a single test file
- `pnpm -F @repo/package-name add dependency` - Add dependency to specific package
</commands>

<architecture>
- Cloudflare Workers monorepo using pnpm workspaces and Turborepo
- `apps/` - Individual Cloudflare Worker applications
- `packages/` - Shared libraries and configurations
  - `@repo/eslint-config` - Shared ESLint configuration
  - `@repo/typescript-config` - Shared TypeScript configuration
  - `@repo/hono-helpers` - Hono framework utilities
  - `@repo/tools` - Development tools and scripts
- Worker apps delegate scripts to `@repo/tools` for consistency
- Hono web framework with helpers in `@repo/hono-helpers`
- Vitest with `@cloudflare/vitest-pool-workers` for testing
- Syncpack ensures dependency version consistency
- Turborepo enables parallel task execution and caching
- Workers configured via `wrangler.jsonc` with environment variables
- Each worker has `context.ts` for typed environment bindings
- Integration tests in `src/test/integration/`
- Workers use `nodejs_compat` compatibility flag
- GitHub Actions deploy automatically on merge to main
- Changesets manage versions and changelogs
</architecture>

<sentry-integration>
**Optional Sentry error tracking and monitoring** - enabled by setting SENTRY_DSN

Three instrumentation patterns available in `@repo/hono-helpers`:
1. **`instrumentHandler()`** - Wraps ExportedHandler with Sentry (for handlers, queues, emails, etc.)
   - Default: 2% trace sampling rate
   - Usage: `export default instrumentHandler({ handler, sentry: { tracesSampleRate: 0.02 } })`

2. **`instrumentDO()`** - Wraps Durable Object classes
   - Default: 2% trace sampling rate
   - Usage: `export const MyDO = instrumentDO<Env>(MyDOClass, { sentry: { tracesSampleRate: 0.02 } })`

3. **`instrumentWorkflow()`** - Wraps Workflow classes
   - Default: 100% trace sampling rate (workflows are important!)
   - Usage: `export const MyWorkflow = instrumentWorkflow<Env, Params>(MyWorkflowClass)`

**Middleware:**
- `withSentry({ op: 'http.server' })` - Adds request-level tracing spans
  - Automatically skips tracing 401/403/404 responses to reduce noise
  - Only active if SENTRY_DSN is configured

**Error Handling:**
- `withOnError()` - Automatically captures 5xx errors and exceptions to Sentry
  - Adds context for HTTP exceptions
  - Handles AggregateError by capturing each error individually
  - Only sends to Sentry if SENTRY_DSN is configured

**Configuration:**
- `SENTRY_DSN` (optional) - Sentry project DSN, Sentry only activates if provided
- `SENTRY_RELEASE` (required) - Release version, automatically set to git commit hash during deployment
- `ENVIRONMENT` (required) - Environment name (development/staging/production)

All Sentry functionality is opt-in via the SENTRY_DSN environment variable.
</sentry-integration>

<code-style>
- Use tabs for indentation, spaces for alignment
- Type imports use `import type`
- Workspace imports use `@repo/` prefix
- Import order: Built-ins → Third-party → `@repo/` → Relative
- Prefix unused variables with `_`
- Prefer `const` over `let`
- Use `array-simple` notation
- Explicit function return types are optional
</code-style>

<critical-notes>
- TypeScript configs MUST use fully qualified paths: `@repo/typescript-config/base.json` not `./base.json`
- Do NOT add 'WebWorker' to TypeScript config - types are in worker-configuration.d.ts or @cloudflare/workers-types
- For lint checking: First `cd` to the package directory, then run `bun turbo check:types check:lint`
- Use `workspace:*` protocol for internal dependencies
- Use `bun turbo -F` for build/test/deploy tasks
- Use `pnpm -F` for dependency management (pnpm is still used for package management)
- Commands delegate to `bun runx` which provides context-aware behavior
- Test commands use `bun vitest` directly, not through turbo
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files over creating new ones
- NEVER proactively create documentation files unless explicitly requested
</critical-notes>

</cloudflare-workers-monorepo>
