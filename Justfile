# This Justfile isn't strictly necessary, but it's
# a convenient way to run commands in the repo
# without needing to remember all commands.

[private]
@help:
  just --list

# Aliases
alias new-pkg := new-package
alias new-worker := gen
alias up := update

# =============================== #
#         DEV COMMANDS            #
# =============================== #

# Install dependencies
[group('dev')]
install:
  pnpm install --child-concurrency=10

# Check for issues with deps, lint, types, format, etc.
[group('dev')]
[no-cd]
check *flags:
  bun runx check {{flags}}

# Fix issues with deps, lint, format, etc.
[group('dev')]
[no-cd]
fix *flags:
  bun runx fix {{flags}}

[group('dev')]
[no-cd]
test *flags:
  bun vitest {{flags}}

[group('dev')]
[no-cd]
build *flags:
  bun turbo build {{flags}}

# =============================== #
#        RUNNER COMMANDS          #
# =============================== #

# Run dev script. Runs turbo dev if not in a specific project directory.
[group('runner')]
[no-cd]
dev *flags:
  bun runx dev {{flags}}

# Run Workers in preview mode (if available)
[group('runner')]
[no-cd]
preview:
  bun run preview

# Deploy Workers
[group('runner')]
[no-cd]
deploy *flags:
  bun turbo deploy {{flags}}

# =============================== #
#       GENERATOR COMMANDS        #
# =============================== #

# Create changeset
[group('generator')]
cs:
  bun run-changeset-new

[group('generator')]
gen *flags:
  bun run-turbo-gen {{flags}}

[group('generator')]
new-package *flags:
  bun run-turbo-gen new-package {{flags}}

# =============================== #
#        UTILITY COMMANDS         #
# =============================== #

# CLI in packages/tools for updating deps, pnpm, etc.
[group('utility')]
update *flags:
  bun runx update {{flags}}

# CLI in packages/tools for running commands in the repo.
[group('utility')]
runx *flags:
  bun runx {{flags}}
