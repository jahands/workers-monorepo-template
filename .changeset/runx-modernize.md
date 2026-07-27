---
'@repo/tools': minor
---

feat: fix package exports and add workspace introspection to runx

The `exports` map pointed at `src/lib/*`, which no longer exists - it now exposes `./path`, `./environment`, `./workspace`, and `./package`. Adds `getWorkspacePackages`, `getWorkspacePackage`, `getWorkersProjects`, and `globProjectFiles` (used by `turbo.config.ts` to derive its build task list), plus a zod-validated `getPackageJson`.

Also anchors `getRepoRoot()` to `import.meta.dirname` so it resolves the same regardless of cwd, runs the workers-types check independently of `--format` and includes it in `runx check` by default, and gives prettier a stable cache location so turbo can cache it.
