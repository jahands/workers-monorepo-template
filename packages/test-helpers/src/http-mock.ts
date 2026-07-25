import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

type Server = ReturnType<typeof setupServer>
type HttpHandler = Parameters<Server['use']>[number]

/**
 * The msw server is created lazily so that importing this module
 * (i.e. from a setup file) doesn't start intercepting requests until
 * a test actually mocks something.
 */
let server: Server | undefined

function getServer(): Server {
	if (server === undefined) {
		const s = setupServer()
		// unhandled requests are an error so tests never hit the network
		s.listen({ onUnhandledRequest: 'error' })
		server = s
	}

	return server
}

/**
 * Mock HTTP requests for the current test.
 *
 * @example
 * useHttpMock(
 *   http.get('https://example.com/hello', () => HttpResponse.json({ hello: 'world' }))
 * )
 */
export function useHttpMock(...handlers: HttpHandler[]): void {
	getServer().use(...handlers)
}

/**
 * Remove all handlers added with {@link useHttpMock}.
 * Typically called in an `afterEach()`.
 */
export function resetHttpMocks(): void {
	server?.resetHandlers()
}

export { HttpResponse, http }
