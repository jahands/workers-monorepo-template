/** Redacts keys from a url */
export function redactUrl(_url: URL | string): URL {
	let url: URL
	if (typeof _url === 'string') {
		url = new URL(_url)
	} else {
		url = new URL(_url.toString()) // clone
	}
	for (const [key] of url.searchParams) {
		if (/key|token|secret|password|passwd|auth|credential/i.test(key)) {
			url.searchParams.set(key, 'REDACTED')
		}
	}
	return url
}

/**
 * Converts a URLSearchParams object into an array of "key=value" strings.
 *
 * @param searchParams - The URLSearchParams object to convert.
 * @returns An array of strings, where each string is in the format "key=value".
 */
export function searchParamsToArray(searchParams: URLSearchParams): string[] {
	const result: string[] = []
	for (const [key, value] of searchParams.entries()) {
		result.push(`${key}=${value}`)
	}
	return result
}
