---
'@repo/oxlint-config': patch
---

fix: remove leftover dagger-specific lint override

Nothing in the repo uses dagger, so the `no-unused-vars` override for `**/dagger/**` was dead config.
