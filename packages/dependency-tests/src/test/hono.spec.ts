import { sValidator } from '@hono/standard-validator'
import { zValidator } from '@hono/zod-validator'
import { type } from 'arktype'
import { Hono } from 'hono'
import { describe, expect, it, test } from 'vitest'

import { z } from '@repo/zod'

import type { Env } from 'hono'

interface TestHarness<T extends Env> {
	app: Hono<T>
	getResponse: (path: string, init?: RequestInit) => Promise<Response>
}

function setupHonoTest<T extends Env>(): TestHarness<T> {
	const app = new Hono<T>()
	return {
		app,
		getResponse: async (path: string, init?: RequestInit) =>
			app.fetch(new Request(`http://localhost${path}`, init)),
	}
}

describe('handlers', () => {
	describe('c.text()', () => {
		test('existing route', async () => {
			const { app, getResponse } = setupHonoTest()
			app.get('/foo', async (c) => c.text('bar'))
			const res = await getResponse('/foo')
			expect(await res.text()).toBe('bar')
			expect(res.status).toBe(200)
		})

		test('non-existent route', async () => {
			const { app, getResponse } = setupHonoTest()
			app.get('/', async (c) => c.text('ok'))
			const res = await getResponse('/foo')
			expect(await res.text()).toBe('404 Not Found')
			expect(res.status).toBe(404)
		})
	})

	describe('c.json()', () => {
		test('existing route', async () => {
			const { app, getResponse } = setupHonoTest()
			app.get('/foo', async (c) => c.json({ foo: 'bar' }))
			const res = await getResponse('/foo')
			expect(await res.json()).toMatchInlineSnapshot(`
				{
				  "foo": "bar",
				}
			`)
			expect(res.status).toBe(200)
		})
	})
})

describe('middleware', () => {
	describe('zValidator and sValidator', () => {
		const validators = [
			['zod', zValidator],
			['std', sValidator],
		] as const as Array<['zod' | 'std', typeof sValidator]>

		async function snapshot(
			name: 'zod' | 'std',
			res: Response,
			{ zod, std }: { zod: (body: any) => void; std: (body: any) => void }
		): Promise<void> {
			const body = await res.text().then((t) => {
				try {
					return JSON.parse(t)
				} catch {
					return t
				}
			})
			if (name === 'zod') {
				zod(body)
			} else if (name === 'std') {
				std(body)
			} else {
				throw new Error('invalid snapshot')
			}
		}

		describe('json', () => {
			const JsonSchema = z.object({ foo: z.string() })
			test.for(validators)(`[%s] happy path`, async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.post('/foo', validator('json', JsonSchema), async (c) => {
					const { foo } = c.req.valid('json')
					return c.json({ foo })
				})
				const res = await getResponse('/foo', {
					method: 'POST',
					body: JSON.stringify({ foo: 'foo1' }),
					headers: { 'Content-Type': 'application/json' },
				})
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "foo1",
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "foo1",
						}
					`),
				})
				expect(res.status).toBe(200)
			})

			test.for(validators)(
				'[%s] non-json content-type throws annoying error',
				async ([name, validator]) => {
					const { app, getResponse } = setupHonoTest()
					app.post('/foo', validator('json', JsonSchema), async (c) => {
						const { foo } = c.req.valid('json')
						return c.json(foo)
					})
					const res = await getResponse('/foo', {
						method: 'POST',
						body: JSON.stringify({ foo: 'foo1' }),
					})
					await snapshot(name, res, {
						zod: (b) =>
							expect(b).toMatchInlineSnapshot(`
							{
							  "error": {
							    "issues": [
							      {
							        "code": "invalid_type",
							        "expected": "string",
							        "message": "Required",
							        "path": [
							          "foo",
							        ],
							        "received": "undefined",
							      },
							    ],
							    "name": "ZodError",
							  },
							  "success": false,
							}
						`),
						std: (b) =>
							expect(b).toMatchInlineSnapshot(`
							{
							  "data": {},
							  "error": [
							    {
							      "code": "invalid_type",
							      "expected": "string",
							      "message": "Required",
							      "path": [
							        "foo",
							      ],
							      "received": "undefined",
							    },
							  ],
							  "success": false,
							}
						`),
					})
					expect(res.status).toBe(400)
				}
			)

			test.for(validators)('[%s] non-json body', async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.post('/foo', validator('json', JsonSchema), async (c) => {
					const { foo } = c.req.valid('json')
					return c.json(foo)
				})
				const res = await getResponse('/foo', {
					method: 'POST',
					body: '{"foo": foo1"', // invalid json
					headers: { 'Content-Type': 'application/json' },
				})
				await snapshot(name, res, {
					zod: (b) => expect(b).toMatchInlineSnapshot(`"Malformed JSON in request body"`),
					std: (b) => expect(b).toMatchInlineSnapshot(`"Malformed JSON in request body"`),
				})
				expect(res.status).toBe(400)
			})

			test.for(validators)('[%s] invalid json value type', async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.post('/foo', validator('json', JsonSchema), async (c) => {
					const { foo } = c.req.valid('json')
					return c.json({ foo })
				})
				const res = await getResponse('/foo', {
					method: 'POST',
					body: JSON.stringify({ foo: 123 }),
					headers: { 'Content-Type': 'application/json' },
				})
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "error": {
						    "issues": [
						      {
						        "code": "invalid_type",
						        "expected": "string",
						        "message": "Expected string, received number",
						        "path": [
						          "foo",
						        ],
						        "received": "number",
						      },
						    ],
						    "name": "ZodError",
						  },
						  "success": false,
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "data": {
						    "foo": 123,
						  },
						  "error": [
						    {
						      "code": "invalid_type",
						      "expected": "string",
						      "message": "Expected string, received number",
						      "path": [
						        "foo",
						      ],
						      "received": "number",
						    },
						  ],
						  "success": false,
						}
					`),
				})
				expect(res.status).toBe(400)
			})
		})

		describe('param', () => {
			test.for(validators)('[%s] happy path', async ([_, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get('/foo/:bar', validator('param', z.object({ bar: z.string() })), async (c) => {
					const { bar } = c.req.valid('param')
					return c.text(bar)
				})
				const res = await getResponse('/foo/bar1')
				expect(await res.text()).toBe('bar1')
				expect(res.status).toBe(200)
			})

			test.for(validators)('[%s] happy path (multiple params)', async ([_, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get(
					'/foo/:bar/:baz',
					validator('param', z.object({ bar: z.string(), baz: z.string() })),
					async (c) => {
						const { bar, baz } = c.req.valid('param')
						return c.text(`${bar}, ${baz}`)
					}
				)
				const res = await getResponse('/foo/bar/baz')
				expect(await res.text()).toBe('bar, baz')
				expect(res.status).toBe(200)
			})

			test.for(validators)(
				'[%s] happy path (multiple params, mixed types)',
				async ([_, validator]) => {
					const { app, getResponse } = setupHonoTest()
					app.get(
						'/foo/:bar/:baz/:qux',
						validator('param', z.object({ bar: z.string(), baz: z.string(), qux: z.string() })),
						async (c) => {
							const { bar, baz, qux } = c.req.valid('param')
							return c.text(`${bar}, ${baz}, ${qux}`)
						}
					)
					const res = await getResponse('/foo/bar1/true/123')
					expect(await res.text()).toBe('bar1, true, 123')
					expect(res.status).toBe(200)
				}
			)

			test.for(validators)('[%s] happy path (coerce)', async ([_, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get(
					'/foo/:bar',
					validator('param', z.object({ bar: z.coerce.number() })),
					async (c) => {
						const { bar } = c.req.valid('param')
						expect(typeof bar).toBe('number')
						return c.text(bar.toString())
					}
				)
				const res = await getResponse('/foo/123')
				expect(await res.text()).toBe('123')
				expect(res.status).toBe(200)
			})

			describe('sValidator works with both Zod and ArkType', () => {
				describe('convert string to number', () => {
					test('zod', async () => {
						const { app, getResponse } = setupHonoTest()
						app.get(
							'/foo/:bar',
							sValidator('param', z.object({ bar: z.coerce.number() })),
							async (c) => {
								const { bar } = c.req.valid('param')
								expect(typeof bar).toBe('number')
								return c.text(bar.toString())
							}
						)
						const res = await getResponse('/foo/123')
						expect(await res.text()).toBe('123')
						expect(res.status).toBe(200)
					})

					test('arktype', async () => {
						const { app, getResponse } = setupHonoTest()
						app.get(
							'/foo/:bar',
							sValidator(
								'param',
								type({
									bar: type('string.numeric.parse'),
								})
							),
							async (c) => {
								const { bar } = c.req.valid('param')
								expect(typeof bar).toBe('number')
								return c.text(bar.toString())
							}
						)
						const res = await getResponse('/foo/123')
						expect(await res.text()).toBe('123')
						expect(res.status).toBe(200)
					})
				})
			})

			test.for(validators)('[%s] missmatched param names', async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get('/foo/:bar', validator('param', z.object({ baz: z.string() })), async (c) => {
					const { baz } = c.req.valid('param')
					return c.text(baz)
				})
				const res = await getResponse('/foo/bar1')
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "error": {
						    "issues": [
						      {
						        "code": "invalid_type",
						        "expected": "string",
						        "message": "Required",
						        "path": [
						          "baz",
						        ],
						        "received": "undefined",
						      },
						    ],
						    "name": "ZodError",
						  },
						  "success": false,
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "data": {
						    "bar": "bar1",
						  },
						  "error": [
						    {
						      "code": "invalid_type",
						      "expected": "string",
						      "message": "Required",
						      "path": [
						        "baz",
						      ],
						      "received": "undefined",
						    },
						  ],
						  "success": false,
						}
					`),
				})

				// Wish this could be a 500 :(
				expect(res.status).toBe(400)
			})
		})

		describe('query', () => {
			const QuerySchema = z.object({ foo: z.string() })
			test.for(validators)('[%s] happy path', async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get('/foo', validator('query', QuerySchema), async (c) => {
					const { foo } = c.req.valid('query')
					return c.json({ foo })
				})
				let res = await getResponse('/foo?foo=bar')
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "bar",
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "bar",
						}
					`),
				})
				expect(res.status).toBe(200)

				res = await getResponse('/foo?foo=123')
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "123",
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "123",
						}
					`),
				})
				expect(res.status).toBe(200)

				res = await getResponse('/foo?foo=123')
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "123",
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "foo": "123",
						}
					`),
				})
				expect(res.status).toBe(200)
			})

			test.for(validators)('[%s] invalid query', async ([name, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get('/foo', validator('query', QuerySchema), async (c) => {
					const { foo } = c.req.valid('query')
					return c.json({ foo })
				})
				const res = await getResponse('/foo?baz=qux')
				await snapshot(name, res, {
					zod: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "error": {
						    "issues": [
						      {
						        "code": "invalid_type",
						        "expected": "string",
						        "message": "Required",
						        "path": [
						          "foo",
						        ],
						        "received": "undefined",
						      },
						    ],
						    "name": "ZodError",
						  },
						  "success": false,
						}
					`),
					std: (b) =>
						expect(b).toMatchInlineSnapshot(`
						{
						  "data": {
						    "baz": "qux",
						  },
						  "error": [
						    {
						      "code": "invalid_type",
						      "expected": "string",
						      "message": "Required",
						      "path": [
						        "foo",
						      ],
						      "received": "undefined",
						    },
						  ],
						  "success": false,
						}
					`),
				})
				expect(res.status).toBe(400)
			})
		})

		describe('multiple validators', () => {
			test.for(validators)('[%s] happy path', async ([_, validator]) => {
				const { app, getResponse } = setupHonoTest()
				app.get(
					'/foo/:bar',
					validator('param', z.object({ bar: z.string() })),
					validator('query', z.object({ baz: z.string() })),
					async (c) => {
						const { bar } = c.req.valid('param')
						const { baz } = c.req.valid('query')
						return c.text(`${bar}, ${baz}`)
					}
				)
				const res = await getResponse('/foo/bar1?baz=baz1')
				expect(await res.text()).toBe('bar1, baz1')
				expect(res.status).toBe(200)
			})
		})
	})

	describe('use() middleware', () => {
		const requestPaths = [
			['/', 404],
			['/foo', 200],
			['/foo/bar', 404],
			['/foo123', 404],
			['/444', 404],
			['/true', 404],
		] as const
		const expectedRes = { 200: 'ok', 404: '404 Not Found' }

		describe(`always runs if no path is given`, () => {
			for (const [path, expectedStatus] of requestPaths) {
				test(`GET ${path}`, async () => {
					const { app, getResponse } = setupHonoTest()
					let ran = false
					app
						.use(async (_c, next) => {
							ran = true
							await next()
						})
						.get('/foo', async (c) => c.text('ok'))

					const res = await getResponse(path)
					expect(ran).toBe(true)
					expect(await res.text()).toBe(expectedRes[expectedStatus])
					expect(res.status).toBe(expectedStatus)
				})
			}
		})

		describe(`always runs with wildcard path`, () => {
			for (const wildcardPath of ['*', '/*']) {
				describe(`use('${wildcardPath}')`, () => {
					for (const [path, expectedStatus] of requestPaths) {
						test(`GET ${path}`, async () => {
							const { app, getResponse } = setupHonoTest()
							let ran = false
							app
								.use(wildcardPath, async (_c, next) => {
									ran = true
									await next()
								})
								.get('/foo', async (c) => c.text('ok'))

							const res = await getResponse(path)
							expect(ran).toBe(true)
							expect(await res.text()).toBe(expectedRes[expectedStatus])
							expect(res.status).toBe(expectedStatus)
						})
					}
				})
			}
		})

		it(`doesn't run if middleware returns response`, async () => {
			const { app, getResponse } = setupHonoTest()
			let ranMiddleware = ''
			app
				.use('*', async (c, _next) => {
					ranMiddleware += 'a'
					return c.text('middleware a')
				})
				.use('*', async (c, _next) => {
					ranMiddleware += 'b'
					return c.text('middleware b')
				})
				.get('/foo', async (c) => {
					ranMiddleware += 'c'
					return c.text('foo1')
				})
			const res = await getResponse('/foo')
			expect(await res.text()).toBe('middleware a')
			expect(res.status).toBe(200)
			expect(ranMiddleware).toBe('a')
		})

		it(`doesn't run if middleware throws error`, async () => {
			const { app, getResponse } = setupHonoTest()
			let ranMiddleware = ''
			app
				.use('*', async (_c, next) => {
					ranMiddleware += 'a'
					await next()
				})
				.use('*', async (_c, _next) => {
					ranMiddleware += 'b'
					throw new Error('middleware b error')
				})
				.get('/foo', async (c) => {
					ranMiddleware += 'c'
					return c.text('foo1')
				})
			const res = await getResponse('/foo')
			expect(await res.text()).toBe('Internal Server Error')
			expect(res.status).toBe(500)
			expect(ranMiddleware).toBe('ab')
		})
	})

	describe('get() middleware', () => {
		test('only runs for get requests', async () => {
			const { app, getResponse } = setupHonoTest()
			let ran = false
			app
				.get('*', async (_c, next) => {
					ran = true
					await next()
				})
				.get('/foo', async (c) => c.text('ok'))

			const res = await getResponse('/foo')
			expect(ran).toBe(true)
			expect(await res.text()).toBe('ok')
			expect(res.status).toBe(200)

			// Make sure it doesn't run for POST requests
			ran = false
			const res2 = await getResponse('/foo', {
				method: 'POST',
			})
			expect(ran).toBe(false)
			expect(await res2.text()).toBe('404 Not Found')
			expect(res2.status).toBe(404)
		})
	})

	describe('Variables', () => {
		test('pass vars between handlers', async () => {
			type App = {
				Variables: {
					foo?: string
					middlewareCount?: number
				}
			}
			const { app, getResponse } = setupHonoTest<App>()

			let middlewareCount = 0
			app
				.use('*', async (c, next) => {
					expect(c.var.middlewareCount).toBe(undefined)
					expect(c.get('middlewareCount')).toBe(undefined)

					expect(c.var.foo).toBe(undefined)
					expect(c.get('foo')).toBe(undefined)

					c.set('middlewareCount', 1)
					expect(c.var.middlewareCount).toBe(1)
					expect(c.get('middlewareCount')).toBe(1)
					c.set('foo', 'bar')
					await next()
				})

				.use('*', async (c, next) => {
					const current = c.var.middlewareCount ?? 0
					expect(current).toBe(1)
					expect(c.get('middlewareCount')).toBe(1)
					c.set('middlewareCount', current + 1)

					expect(c.var.middlewareCount).toBe(2)
					expect(c.get('middlewareCount')).toBe(2)

					expect(c.var.foo).toBe('bar')
					await next()
				})

				.get('/foo', async (c) => {
					const current = c.var.middlewareCount ?? 0
					expect(current).toBe(2)
					expect(c.get('middlewareCount')).toBe(2)
					c.set('middlewareCount', current + 1)

					expect(c.var.middlewareCount).toBe(3)
					expect(c.get('middlewareCount')).toBe(3)

					expect(c.var.foo).toBe('bar')
					middlewareCount = c.var.middlewareCount ?? 0
					return c.text('ok')
				})

			const res = await getResponse('/foo')
			expect(await res.text()).toBe('ok')
			expect(res.status).toBe(200)
			expect(middlewareCount).toBe(3)
		})
	})
})
