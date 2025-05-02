import { fetchMock } from 'cloudflare:test'

/**
 * Remove all pending and non-pending fetchMock interceptors
 */
export function resetFetchMocks(hostnameFilter?: string | string[]): void {
	// This is pretty hacky, but fetchMock does not currently expose
	// a way to clear pending interceptors so we have to dig into
	// the object and do it manually.
	// Adapted from: https://github.com/nodejs/undici/issues/3737#issuecomment-2463938817

	clearInterceptors(hostnameFilter)
	clearPendingInterceptors(hostnameFilter)
}

function clearInterceptors(hostnameFilter?: string | string[]): void {
	const kAgent = Object.getOwnPropertySymbols(fetchMock).find(
		(s) => s.toString() === 'Symbol(agent)'
	)
	if (!kAgent) {
		return
	}
	// @ts-ignore
	const agent = fetchMock[kAgent]

	const kClients = Object.getOwnPropertySymbols(agent).find(
		(s) => s.toString() === 'Symbol(clients)'
	)

	// @ts-ignore
	for (const key of agent[kClients].keys()) {
		// @ts-ignore
		if (hostnameFilter === undefined || toArray(hostnameFilter).includes(new URL(key).hostname)) {
			// @ts-ignore
			fetchMock[kClients].delete(key)
		}
	}
}

/**
 * Remove all pending interceptors from fetchMock
 */
function clearPendingInterceptors(hostnameFilter?: string | string[]): void {
	if (!fetchMock.pendingInterceptors().length) {
		return
	}
	const kClients = Object.getOwnPropertySymbols(fetchMock).find(
		(s) => s.toString() === 'Symbol(clients)'
	)
	if (!kClients) {
		return
	}

	// @ts-ignore
	for (const key of fetchMock[kClients].keys()) {
		if (hostnameFilter === undefined || toArray(hostnameFilter).includes(new URL(key).hostname)) {
			// @ts-ignore
			fetchMock[kClients].delete(key)
		}
	}
}

function toArray<T>(val: T | T[]): T[] {
	return Array.isArray(val) ? val : [val]
}
