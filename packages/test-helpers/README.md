# test-helpers

Shared helpers around testing.

| Entrypoint                      | Contents                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@repo/test-helpers`            | Runtime detection helpers (`isWorkers()`, `isNode()`)                                            |
| `@repo/test-helpers/test`       | HTTP mocking (`useHttpMock()`, `resetHttpMocks()`, `http`, `HttpResponse`)                       |
| `@repo/test-helpers/matchers`   | Custom matchers (`toBeUUID()`, `toBeAfterDate()`, `toBeGreaterThan()`) — import for side effects |
| `@repo/test-helpers/serializer` | Opt-in snapshot serializers — import for side effects                                            |
| `@repo/test-helpers/suite`      | `testSuite()` — `test`/`it` with a test harness fixture                                          |

See `apps/example-worker-echoback/src/test/setup.ts` for an example of wiring the
matchers, serializers and HTTP mocking into a worker's vitest setup file.
