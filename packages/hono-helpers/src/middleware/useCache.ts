import { httpStatus } from 'http-codex/status'

import type { Context, Next } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'
import type { HonoApp } from '../types'

/** Caches status: 200 responses for given ttl */
export function useCache<T extends HonoApp>(ttl: number) {
	return async (ctx: Context<T>, next: Next): Promise<Response | void> => {
		const c = ctx as unknown as Context<HonoApp>

		const cache = await caches.open('default')
		const reqMatcher = new Request(c.req.url, { method: c.req.method })
		const cachedRes = await cache.match(reqMatcher)
		if (cachedRes) {
			return c.newResponse(cachedRes.body, cachedRes)
		}
		await next()

		if (c.res.status === httpStatus.OK) {
			const clonedRes = c.res.clone()
			clonedRes.headers.set('Cloudflare-CDN-Cache-Control', `max-age=${ttl}`)
			c.executionCtx.waitUntil(cache.put(reqMatcher, clonedRes))
		}
	}
}

/** Caches using default CF Cache behavior */
export function useCacheDefault<T extends HonoApp>(ttl: number) {
	return async (ctx: Context<T>, next: Next): Promise<Response | void> => {
		const c = ctx as unknown as Context<HonoApp>

		const cache = await caches.open('default')
		const cachedRes = await cache.match(c.req.raw)
		if (cachedRes) {
			return c.newResponse(cachedRes.body, cachedRes)
		}
		await next()
		const clonedRes = c.res.clone()
		clonedRes.headers.set('Cloudflare-CDN-Cache-Control', `max-age=${ttl}`)
		c.executionCtx.waitUntil(cache.put(c.req.raw, clonedRes))
	}
}

interface CacheByStatus {
	status: StatusCode
	/** Time in milliseconds to cache this status */
	ttl: number
}

interface useCacheByStatusOptions {
	rules: CacheByStatus[]
	/** Force caching rather than using default CF cache behavior */
	force: boolean
}
/** Caches responses based on status */
export function useCacheByStatus<T extends HonoApp>(options: useCacheByStatusOptions) {
	return async (ctx: Context<T>, next: Next): Promise<Response | void> => {
		const c = ctx as unknown as Context<HonoApp>

		const cache = await caches.open('default')
		const reqMatcher = options.force ? new Request(c.req.url, { method: c.req.method }) : c.req.raw
		const cachedRes = await cache.match(reqMatcher)
		if (cachedRes) {
			return c.newResponse(cachedRes.body, cachedRes)
		}
		await next()
		const opts = options.rules.find((o) => o.status === c.res.status)
		if (opts) {
			const clonedRes = c.res.clone()
			clonedRes.headers.set('Cloudflare-CDN-Cache-Control', `max-age=${opts.ttl}`)
			c.executionCtx.waitUntil(cache.put(reqMatcher, clonedRes))
		}
	}
}
