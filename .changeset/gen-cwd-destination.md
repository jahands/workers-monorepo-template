---
'@repo/turbo-generators': minor
---

feat: create new Workers and packages in the current directory

The `gen` and `new-package` justfile recipes no longer cd to the workspace root, and generators derive the destination from the directory they were run from, falling back to `apps/`/`packages/` at the root.

Also fixes `new-package` post-generation steps aborting with `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN`: `fixDepsAndFormat` now runs `bun runx fix --deps`, then `pnpm install`, then `bun runx fix --format` (matching the Worker generators), and `pnpmInstall` no longer filters the install to the new package.
