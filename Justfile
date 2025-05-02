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
  pnpm run dev {{flags}}

# Run preview script
[no-cd]
preview *flags:
  pnpm run preview {{flags}}

# Create changeset
cs:
  pnpm run-changeset-new

# Fix deps, lint, format, etc.
[no-cd]
fix *flags:
  pnpm runx fix {{flags}}

# Run test cli
[no-cd]
test *flags:
  pnpm runx test --auto-build {{flags}}

# Run tests for all packages
test-all *flags:
  pnpm turbo test:ci --log-order=grouped {{flags}}

[no-cd]
build *flags:
  pnpm turbo build {{flags}}

# Check for issues with deps/lint/types/format
[no-cd]
check *flags:
  pnpm runx check {{flags}}

# Update things in the repo
update *flags:
  pnpm runx update {{flags}}

# Run turbo generate
gen:
  pnpm run gen
