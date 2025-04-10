import { type } from 'arktype'
import { assert, describe, expect, it, test } from 'vitest'

describe('arktype', () => {
	it('validates objects', () => {
		type User = typeof User.infer
		const User = type({
			/** The user's name */
			name: 'string',
			platform: "'android' | 'ios'",
			'versions?': '(number | string)[]',
		})

		expect(() => {
			const out = User({ name: 'jacob', platform: 'invalid' })
			if (out instanceof type.errors) {
				throw out.throw()
			}
		}).toThrowErrorMatchingInlineSnapshot(
			`[TraversalError: platform must be "android" or "ios" (was "invalid")]`
		)

		const out = User({ name: 'jacob', platform: 'android' })
		if (out instanceof type.errors) {
			throw new Error(out.summary)
		}
		expect(out).toMatchInlineSnapshot(`
			{
			  "name": "jacob",
			  "platform": "android",
			}
		`)
	})

	it('can pipe and transform', () => {
		const parseJson = type('string').pipe.try(
			(s) => JSON.parse(s),
			type({
				foo: 'string',
			})
		)

		const out = parseJson('{"foo": "bar"}')
		assert(!(out instanceof type.errors))
		expect(out).toMatchInlineSnapshot(`
			{
			  "foo": "bar",
			}
		`)

		const out2 = parseJson('{"foo2": "bar"}')
		assert(out2 instanceof type.errors)
		expect(out2.summary).toMatchInlineSnapshot(`"foo must be a string (was missing)"`)
	})

	test('string.json.parse', () => {
		// .to is a sugared .pipe for a single parsed output validator
		const parseJson = type('string.json.parse').to({
			name: 'string',
			version: 'string.semver',
		})

		const out = parseJson('{ "name": true, "version": "v2.0.0" }')

		assert(out instanceof type.errors)
		expect(out.summary).toMatchInlineSnapshot(`
			"name must be a string (was boolean)
			version must be a semantic version (see https://semver.org/) (was "v2.0.0")"
		`)
	})

	it('throws error when using .assert()', () => {
		const User = type({
			name: type('string').atLeastLength(1),
			username: type('string').atLeastLength(1),
		})

		expect(() => User.assert({ name: '', username: 'jh' })).toThrowErrorMatchingInlineSnapshot(
			`[TraversalError: name must be non-empty]`
		)

		expect(() => User.assert({ name: '', username: '' })).toThrowErrorMatchingInlineSnapshot(
			`
			[TraversalError: 
			  • name must be non-empty
			  • username must be non-empty]
		`
		)

		const out = User.assert({ name: 'jacob', username: 'jh' })
		expect(out).toMatchInlineSnapshot(`
			{
			  "name": "jacob",
			  "username": "jh",
			}
		`)
	})
})
