# @repo/zod

This package re-exports the standard `zod` library along with additional type-safe parsing helpers:

- `parse()`

  - Type-safe version of `schema.parse()` that ensures the input type matches the schema's expected input type

- `safeParse()`

  - Type-safe version of `schema.safeParse()` that ensures the input type matches the schema's expected input type

- `safeParseAsync()`
  - Type-safe version of `schema.safeParseAsync()` that ensures the input type matches the schema's expected input type

These helper functions ensure that the input value provided to the parsing functions matches the schema's expected input type to ensure type-safe inputs.
