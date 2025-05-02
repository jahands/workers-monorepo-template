import { SELF } from 'cloudflare:test'
import { describe, expect, it, test } from 'vitest'

import '../..'

describe('echoback returns data about the request', () => {
	test('GET', async () => {
		const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
			headers: {
				'X-Test': 'true',
			},
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchInlineSnapshot(`
			{
			  "body": null,
			  "headers": {
			    "x-test": "true",
			  },
			  "host": "example.com",
			  "hostname": "example.com",
			  "method": "GET",
			  "path": "/stuff",
			  "url": "https://example.com/stuff?foo=bar",
			}
		`)
	})

	test('POST', async () => {
		const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
			method: 'POST',
			body: 'hello world!',
			headers: {
				'X-Test': 'true',
			},
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchInlineSnapshot(`
			{
			  "body": "hello world!",
			  "headers": {
			    "content-length": "12",
			    "content-type": "text/plain;charset=UTF-8",
			    "x-test": "true",
			  },
			  "host": "example.com",
			  "hostname": "example.com",
			  "method": "POST",
			  "path": "/stuff",
			  "url": "https://example.com/stuff?foo=bar",
			}
		`)
	})

	test('PUT', async () => {
		const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
			method: 'PUT',
			body: 'hello world!',
			headers: {
				'X-Test': 'true',
			},
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchInlineSnapshot(`
			{
			  "body": "hello world!",
			  "headers": {
			    "content-length": "12",
			    "content-type": "text/plain;charset=UTF-8",
			    "x-test": "true",
			  },
			  "host": "example.com",
			  "hostname": "example.com",
			  "method": "PUT",
			  "path": "/stuff",
			  "url": "https://example.com/stuff?foo=bar",
			}
		`)
	})

	test('PATCH', async () => {
		const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
			method: 'PATCH',
			body: 'hello world!',
			headers: {
				'X-Test': 'true',
			},
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchInlineSnapshot(`
			{
			  "body": null,
			  "headers": {
			    "content-length": "12",
			    "content-type": "text/plain;charset=UTF-8",
			    "x-test": "true",
			  },
			  "host": "example.com",
			  "hostname": "example.com",
			  "method": "PATCH",
			  "path": "/stuff",
			  "url": "https://example.com/stuff?foo=bar",
			}
		`)
	})

	test('DELETE', async () => {
		const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
			method: 'DELETE',
			body: 'hello world!',
			headers: {
				'X-Test': 'true',
			},
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchInlineSnapshot(`
			{
			  "body": null,
			  "headers": {
			    "content-length": "12",
			    "content-type": "text/plain;charset=UTF-8",
			    "x-test": "true",
			  },
			  "host": "example.com",
			  "hostname": "example.com",
			  "method": "DELETE",
			  "path": "/stuff",
			  "url": "https://example.com/stuff?foo=bar",
			}
		`)
	})
})

it(`Doesn't return body for HEAD`, async () => {
	const res = await SELF.fetch('https://example.com/stuff?foo=bar', {
		method: 'HEAD',
		headers: {
			'X-Test': 'true',
		},
	})
	expect(res.status).toBe(200)
	expect(await res.text()).toMatchInlineSnapshot(`""`)
})
