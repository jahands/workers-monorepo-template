import { match, P } from 'ts-pattern'

/** Get hostname from url in lower case */
export function getUrlHostname(url: string | URL): string {
	return match(url)
		.with(P.string, (u) => new URL(u).hostname)
		.otherwise((u) => u.hostname)
		.toLowerCase()
}
