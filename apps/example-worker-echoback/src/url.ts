/** Get hostname from url in lower case */
export function getUrlHostname(url: string | URL): string {
	const hostname = typeof url === 'string' ? new URL(url).hostname : url.hostname
	return hostname.toLowerCase()
}
