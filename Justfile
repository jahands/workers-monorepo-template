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

# Create changeset
cs:
  pnpm run-changeset-new

# Fix deps, lint, format, etc.
[no-cd]
fix *flags:
  pnpm runx fix {{flags}}

test *flags:
  pnpm vitest {{flags}}

[no-cd]
build *flags:
  pnpm turbo build {{flags}}

# Check for issues with deps/lint/types/format
check *flags:
  pnpm check

# Update things in the repo
update *flags:
  pnpm runx update {{flags}}

