import { redactUrl } from './url'

import type { Context } from 'hono'
import type { HonoApp } from '../types'

export interface LogDataRequest {
	url: string
	method: string
	path: string
	/** Hono route for the request */
	routePath: string
	/* URL search params */
	searchParams: string
	headers: string
	/** Eyeball IP address of the request */
	ip?: string
	timestamp: string
}

/**
 * Get logdata from request
 */
export function getRequestLogData<T extends HonoApp>(
	c: Context<T>,
	requestStartTimestamp: number
): LogDataRequest {
	const redactedUrl = redactUrl(c.req.url)
	return {
		url: redactedUrl.toString(),
		method: c.req.method,
		path: c.req.path,
		routePath: c.req.routePath,
		searchParams: redactedUrl.searchParams.toString(),
		headers: stringifyHeaders(c.req.raw.headers),
		ip:
			c.req.header('cf-connecting-ip') ||
			c.req.header('x-real-ip') ||
			c.req.header('x-forwarded-for'),
		timestamp: new Date(requestStartTimestamp).toISOString(),
	}
}

const SENSITIVE_HEADER_NAMES = new Set([
	'authorization',
	'proxy-authorization',
	'cookie',
	'set-cookie',
	'cf-access-jwt-assertion',
])

function isSensitiveHeader(name: string): boolean {
	const normalizedName = name.toLowerCase()

	return (
		SENSITIVE_HEADER_NAMES.has(normalizedName) ||
		normalizedName.includes('token') ||
		normalizedName.includes('secret') ||
		normalizedName.includes('jwt') ||
		normalizedName.includes('signature') ||
		normalizedName.includes('session') ||
		normalizedName.endsWith('-key') ||
		normalizedName.endsWith('_key')
	)
}

function stringifyHeaders(headers: Headers): string {
	return JSON.stringify(
		Object.fromEntries(
			Array.from(headers, ([name, value]) => [name, isSensitiveHeader(name) ? 'REDACTED' : value])
		)
	)
}
