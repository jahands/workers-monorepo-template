import { SELF } from 'cloudflare:test'
import { describe, expect, test } from 'vitest'

import { z } from '@repo/zod'

const redactedSearchParams = [
	'key',
	'KEY',
	'apikey',
	'api_key',
	'token',
	'sk_',
	'sk_foo',
	'rk_',
	'rk_foo',
	'ghu_',
	'ghu_foo',
	'ghp_',
	'ghp_foo',
	'gha_',
	'gha_foo',
] as const satisfies string[]

const nonRedactedSearchParams: string[] = ['somekey']

const redactedHeaders: string[] = [
	'cf-connecting-ip',
	'X-Some-IP',
	'x-real-ip',
	'x-forwarded-for',
	'cookie',
	'authorization',
	'x-api-token',
	'x-some-token',
	'x-api-key',
	'x-some-key',
]
const nonRedactedHeaders: string[] = ['x-some-header', 'cf-ray']

function getRequest(hostname: string): Request {
	const url = new URL(`https://${hostname}/stuff`)
	for (const key of redactedSearchParams) {
		url.searchParams.set(key, 'svalue')
	}
	for (const key of nonRedactedSearchParams) {
		url.searchParams.set(key, 'value')
	}
	const req = new Request(url)
	for (const key of redactedHeaders) {
		req.headers.set(key, 'svalue')
	}
	for (const key of nonRedactedHeaders) {
		req.headers.set(key, 'value')
	}
	return req
}

type ResponseBody = z.infer<typeof ResponseBody>
const ResponseBody = z.object({
	headers: z.record(z.string(), z.string()),
	url: z
		.string()
		.url()
		.transform((url) => url.split('&')),
})

async function getResponse(hostname: string): Promise<ResponseBody> {
	const req = getRequest(hostname)
	const res = await SELF.fetch(req, { redirect: 'manual' })
	expect(res.status).toBe(200)
	return ResponseBody.parse(await res.json())
}

function assertRedacted(res: ResponseBody): void {
	const hostname = new URL(z.string().url().parse(res.url[0])).hostname
	expect(res).toStrictEqual({
		headers: {
			authorization: '[REDACTED]',
			'cf-connecting-ip': '[REDACTED]',
			'cf-ray': 'value',
			cookie: '[REDACTED]',
			'x-api-key': '[REDACTED]',
			'x-api-token': '[REDACTED]',
			'x-forwarded-for': '[REDACTED]',
			'x-real-ip': '[REDACTED]',
			'x-some-header': 'value',
			'x-some-ip': '[REDACTED]',
			'x-some-key': '[REDACTED]',
			'x-some-token': '[REDACTED]',
		},
		url: [
			`https://${hostname}/stuff?key=REDACTED`,
			'KEY=REDACTED',
			'apikey=REDACTED',
			'api_key=REDACTED',
			'token=REDACTED',
			'sk_=REDACTED',
			'sk_foo=REDACTED',
			'rk_=REDACTED',
			'rk_foo=REDACTED',
			'ghu_=REDACTED',
			'ghu_foo=REDACTED',
			'ghp_=REDACTED',
			'ghp_foo=REDACTED',
			'gha_=REDACTED',
			'gha_foo=REDACTED',
			'somekey=value',
		],
	})
}

function assertNotRedacted(res: ResponseBody): void {
	const hostname = new URL(z.string().url().parse(res.url[0])).hostname
	expect(res).toStrictEqual({
		headers: {
			authorization: 'svalue',
			'cf-connecting-ip': 'svalue',
			'cf-ray': 'value',
			cookie: 'svalue',
			'x-api-key': 'svalue',
			'x-api-token': 'svalue',
			'x-forwarded-for': 'svalue',
			'x-real-ip': 'svalue',
			'x-some-header': 'value',
			'x-some-ip': 'svalue',
			'x-some-key': 'svalue',
			'x-some-token': 'svalue',
		},
		url: [
			`https://${hostname}/stuff?key=svalue`,
			'KEY=svalue',
			'apikey=svalue',
			'api_key=svalue',
			'token=svalue',
			'sk_=svalue',
			'sk_foo=svalue',
			'rk_=svalue',
			'rk_foo=svalue',
			'ghu_=svalue',
			'ghu_foo=svalue',
			'ghp_=svalue',
			'ghp_foo=svalue',
			'gha_=svalue',
			'gha_foo=svalue',
			'somekey=value',
		],
	})
}

describe('does not redact non-redacted subdomains', async () => {
	test.for([
		'example.com',
		'notredacted.echoback.dev',
		'foo.notredacted.echoback.dev',
		'notredact.echoback.dev',
		'foo.notredact.echoback.dev',
		'notr.echoback.dev',
		'foo.notr.echoback.dev',
	])('%s', async (hostname) => {
		assertNotRedacted(await getResponse(hostname))
	})
})

describe('redacts search params and headers for redacted subdomains', async () => {
	test.for([
		'redacted.echoback.dev',
		'foo.redacted.echoback.dev',
		'redact.echoback.dev',
		'foo.redact.echoback.dev',
		'r.echoback.dev',
		'foo.r.echoback.dev',
	])('%s', async (hostname) => {
		assertRedacted(await getResponse(hostname))
	})
})
