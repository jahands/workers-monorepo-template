import { routePath } from 'hono/route'

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
	const currentPath = routePath(c)

	return {
		url: redactedUrl.toString(),
		method: c.req.method,
		path: c.req.path,
		routePath: currentPath,
		searchParams: redactedUrl.searchParams.toString(),
		headers: JSON.stringify(Array.from(c.req.raw.headers)),
		ip:
			c.req.header('cf-connecting-ip') ||
			c.req.header('x-real-ip') ||
			c.req.header('x-forwarded-for'),
		timestamp: new Date(requestStartTimestamp).toISOString(),
	}
}
