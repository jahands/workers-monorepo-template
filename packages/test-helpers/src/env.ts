/**
 * Returns true if running in Cloudflare Workers
 */
export function isWorkers(): boolean {
	return navigator.userAgent.toLowerCase() === 'cloudflare-workers'
}

/**
 * Returns true if running in Node.js
 */
export function isNode(): boolean {
	return navigator.userAgent.toLowerCase().startsWith('node.js/')
}
