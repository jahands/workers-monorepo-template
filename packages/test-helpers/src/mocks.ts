import { fetchMock } from 'cloudflare:test'

/**
 * Mock requests to trace exporter
 */
export function mockTraceExports(): void {
	fetchMock
		.get('https://api-axiom-co.vitest.echoback.dev')
		.intercept({ method: 'POST', path: '/v1/traces' })
		.reply(200, 'ok')
		.persist()
}
