import { match, P } from 'ts-pattern'

const redactedHosts = [
	'redacted.echoback.dev',
	'redact.echoback.dev',
	'r.echoback.dev',
] as const satisfies string[]

/**
 * Returns true if a hostname is redacted
 */
export function isHostnameRedacted(hostname: string): boolean {
	return match(hostname)
		.with(...redactedHosts, () => true)
		.with(
			P.when((hName) => redactedHosts.some((redactedHost) => hName.endsWith(`.${redactedHost}`))),
			() => true
		)
		.otherwise(() => false)
}

// Update test/integration/redact.api.test.ts when updating!
const redactedKeys: string[] = ['key', 'apikey', 'api_key', 'token']
const redactedKeyPrefixes: string[] = ['sk_', 'rk_', 'ghu_', 'ghp_', 'gha_']

/** Redacts keys from a url */
export function redactUrl(_url: URL | string): URL {
	const url = match(_url)
		.with(P.string, (url) => new URL(url))
		.otherwise((url) => new URL(url.toString())) // clone

	for (const [key, _] of Array.from(url.searchParams)) {
		const keyLower = key.toLowerCase()
		if (redactedKeys.includes(keyLower)) {
			url.searchParams.set(key, 'REDACTED')
		} else if (redactedKeyPrefixes.some((p) => keyLower.startsWith(p))) {
			url.searchParams.set(key, 'REDACTED')
		}
	}
	return url
}

// Update test/integration/redact.api.test.ts when updating!
const redactedHeaders: string[] = ['x-forwarded-for', 'cookie', 'authorization']
const redactedHeaderSuffixes: string[] = ['-ip', '-key', '-token']

/**
 * Returns cloned headers with redacted values
 */
export function redactHeaders(headers: Headers): Headers {
	const _headers = new Headers(headers)
	for (const h of redactedHeaders) {
		if (_headers.has(h)) {
			_headers.set(h, '[REDACTED]')
		}
	}

	for (const hKey of _headers.keys()) {
		if (redactedHeaderSuffixes.some((rh) => hKey.toLowerCase().endsWith(rh))) {
			_headers.set(hKey, '[REDACTED]')
		}
	}
	return _headers
}
