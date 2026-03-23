# example-worker-echoback

A simple example Worker. New Workers should use `tsconfig.json` and package layout similar to the one here; repo-wide linting uses oxlint at the monorepo root, although can be overridden by adding `oxlint.config.ts` to the Worker with the following:

```ts
// oxlint.config.ts
import { defineConfig, getConfig } from '@repo/oxlint-config'

const config = getConfig()

export default defineConfig({
  ...config,
  // Add overrides as needed here
})
```
