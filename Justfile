set shell := ["zsh", "-c"]

alias up := update

[private]
@help:
  just --list

# Install dependencies
install:
  pnpm install --child-concurrency=10

# Run dev script
[no-cd]
dev *flags:
  bun run dev {{flags}}

# Run preview script
[no-cd]
preview *flags:
  bun run preview {{flags}}

# Create changeset
cs:
  bun run-changeset-new

# Fix deps, lint, format, etc.
[no-cd]
fix *flags:
  bun runx fix {{flags}}

# Sync vscode workspace settings
sync:
  bun runx settings sync-workspaces

# Run test cli
[no-cd]
test *flags:
  bun runx test --auto-build {{flags}}

# Run tests for all packages
test-all *flags:
  bun turbo test:ci --log-order=grouped {{flags}}

[no-cd]
build *flags:
  bun turbo build {{flags}}

# Check for issues with deps/lint/types/format
[no-cd]
check *flags:
  bun runx check {{flags}}

# Update things in the repo
update *flags:
  bun runx update {{flags}}

# Run turbo generate
gen:
  bun run gen
