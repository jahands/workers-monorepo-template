# @repo/test-helpers

## 0.2.0

### Minor Changes

- 11c2532: feat: add @repo/test-helpers

  A source-only package of vitest helpers, wired into the example worker as a working example:
  - `/test` - msw-based HTTP mocking via `useHttpMock()`. The server starts lazily and runs with `onUnhandledRequest: 'error'`, so un-mocked outbound requests fail the test instead of hitting the network.
  - `/matchers` - `toBeUUID()`, `toBeAfterDate()`, and a `toBeGreaterThan()` that fails instead of throwing on non-numbers
  - `/serializer` - snapshot serializers scoped per test, so enabling one doesn't leak into later tests
  - `/suite` - `testSuite()`, vitest `test` pre-extended with a harness fixture
  - root - `isWorkers()` / `isNode()` runtime detection
