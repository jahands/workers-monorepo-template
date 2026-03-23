# `@repo/oxlint-config`

Collection of internal oxlint configurations.

## Adding additional configs

You may want to add additional configs with overrides for different frameworks.

For example, you can add a TanStack Start config by adding `src/tanstack.config.ts`:

```ts
// src/tanstack.config.ts
import { getConfig } from '@repo/oxlint-config'

import type { OxlintConfig } from 'oxlint'

const config = getConfig()

export function getTanstackConfig() {
  return {
    ...config,
    ignorePatterns: [...config.ignorePatterns, 'src/routeTree.gen.ts'],
  } as const satisfies OxlintConfig
}
```

And then updating [package.json](./package.json) exports:

```json
	"exports": {
		".": "./src/default.config.ts",
		"./tanstack": "./src/tanstack.config.ts"
	},
```

Finally, import it to your TanStack Start app:

```ts
// apps/my-tanstack-project/oxlint.config.ts
import { defineConfig } from '@repo/oxlint-config'
import { getTanstackConfig } from '@repo/oxlint-config/tanstack'

export default defineConfig(getTanstackConfig())
```
