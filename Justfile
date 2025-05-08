# This Justfile isn't strictly necessary, but it's
# a convenient way to run commands in the repo
# without needing to remember all commands.

[private]
@help:
  just --list

# Install dependencies
install:
  pnpm install --child-concurrency=10

# Run dev script
[no-cd]
dev *flags:
  pnpm run dev {{flags}}

# Run preview script (usually only used in apps using Vite)
[no-cd]
preview:
  pnpm run preview

# Create changeset
cs:
  pnpm run-changeset-new

# Check for issues with deps/lint/types/format
[no-cd]
check *flags:
  pnpm runx check {{flags}}

# Fix deps, lint, format, etc.
[no-cd]
fix *flags:
  pnpm runx fix {{flags}}

[no-cd]
test *flags:
  pnpm vitest {{flags}}

[no-cd]
build *flags:
  pnpm turbo build {{flags}}

# Deploy Workers, etc.
deploy *flags:
  pnpm turbo deploy {{flags}}

# Update dependencies using syncpack
update-deps:
  pnpm update-deps

# Create a new Worker/package/etc. from a template (see `turbo/generators` for details)
gen *flags:
  pnpm run-turbo-gen {{flags}}
alias new-worker := gen

new-package *flags:
  pnpm run-turbo-gen new-package {{flags}}
alias new-pkg := new-package
