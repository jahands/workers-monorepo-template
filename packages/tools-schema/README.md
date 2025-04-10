# @repo/tools-schema

This package is for schemas shared between @repo/tools and other packages.

This is needed to avoid circular dependencies and avoid needing to store these types in @repo/tools directly (which would mean we need to move tools from deps to devDeps of the package that imports it, which seems bad).

NOTE: We still utilize tools via the repo root's dependency on tools, but I'm okay with this to ensure we can still run checks.
