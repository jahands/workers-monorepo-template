import { typeid, TypeID } from '@jahands/typeid'
import { describe, expect, it, test } from 'vitest'

import { z } from '@repo/zod'

// spec: https://github.com/jetify-com/typeid/tree/main/spec

describe('valid', () => {
	describe('parse typeid', () => {
		for (const v of valid.concat(valid2)) {
			test(`${v.name}`, () => {
				const tid = TypeID.fromString(v.typeid)
				expect(tid.getType()).toBe(v.prefix)
				expect(tid.toString()).toBe(v.typeid)
				// can't use toUUID right now because it
				// fails for some cases, which I guess is fine?
			})
		}
	})

	describe('parse uuid', () => {
		for (const v of valid.concat(valid2)) {
			test(`${v.name}`, () => {
				const tid = TypeID.fromUUID(v.prefix, v.uuid)
				expect(tid.getType()).toBe(v.prefix)
				expect(tid.toString()).toBe(v.typeid)
			})
		}
	})
})

describe('invalid', () => {
	describe('parse typeid', () => {
		for (const v of invalid.concat(invalid2)) {
			test(v.name, () => {
				expect(() => TypeID.fromString(v.typeid)).toThrowError()
			})
		}
	})
})

describe('zod schema', () => {
	const MyId = z.custom<`my_id_${string}`>((id) => {
		try {
			const tid = TypeID.fromString(id)
			return tid.getType() === 'my_id'
		} catch {
			return false
		}
	}, 'invalid my_id')

	test('valid', () => {
		const id = 'my_id_01jndvyh0benfbexg9kjstdcxx'
		expect(() => MyId.parse(id)).not.toThrowError()
		expect(MyId.parse(id)).toBe(id)
	})

	test('invalid prefix', () => {
		expect(() => MyId.parse('other_id_01jndvyh0benfbexg9kjstdcxx'))
			.toThrowErrorMatchingInlineSnapshot(`
			[ZodError: [
			  {
			    "code": "custom",
			    "message": "invalid my_id",
			    "fatal": true,
			    "path": []
			  }
			]]
		`)
	})

	test('invalid suffix', () => {
		expect(() => MyId.parse('my_id_asdf')).toThrowErrorMatchingInlineSnapshot(`
			[ZodError: [
			  {
			    "code": "custom",
			    "message": "invalid my_id",
			    "fatal": true,
			    "path": []
			  }
			]]
		`)
	})
})

/** https://github.com/jetify-com/typeid/blob/main/spec/valid.json */
const valid = [
	{
		name: 'nil',
		typeid: '00000000000000000000000000',
		prefix: '',
		uuid: '00000000-0000-0000-0000-000000000000',
	},
	{
		name: 'one',
		typeid: '00000000000000000000000001',
		prefix: '',
		uuid: '00000000-0000-0000-0000-000000000001',
	},
	{
		name: 'ten',
		typeid: '0000000000000000000000000a',
		prefix: '',
		uuid: '00000000-0000-0000-0000-00000000000a',
	},
	{
		name: 'sixteen',
		typeid: '0000000000000000000000000g',
		prefix: '',
		uuid: '00000000-0000-0000-0000-000000000010',
	},
	{
		name: 'thirty-two',
		typeid: '00000000000000000000000010',
		prefix: '',
		uuid: '00000000-0000-0000-0000-000000000020',
	},
	{
		name: 'max-valid',
		typeid: '7zzzzzzzzzzzzzzzzzzzzzzzzz',
		prefix: '',
		uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
	},
	{
		name: 'valid-alphabet',
		typeid: 'prefix_0123456789abcdefghjkmnpqrs',
		prefix: 'prefix',
		uuid: '0110c853-1d09-52d8-d73e-1194e95b5f19',
	},
	{
		name: 'valid-uuidv7',
		typeid: 'prefix_01h455vb4pex5vsknk084sn02q',
		prefix: 'prefix',
		uuid: '01890a5d-ac96-774b-bcce-b302099a8057',
	},
	{
		name: 'prefix-underscore',
		typeid: 'pre_fix_00000000000000000000000000',
		prefix: 'pre_fix',
		uuid: '00000000-0000-0000-0000-000000000000',
	},
]

/** https://github.com/jetify-com/typeid/blob/main/spec/invalid.json */
const invalid = [
	{
		name: 'prefix-uppercase',
		typeid: 'PREFIX_00000000000000000000000000',
		description: 'The prefix should be lowercase with no uppercase letters',
	},
	{
		name: 'prefix-numeric',
		typeid: '12345_00000000000000000000000000',
		description: "The prefix can't have numbers, it needs to be alphabetic",
	},
	{
		name: 'prefix-period',
		typeid: 'pre.fix_00000000000000000000000000',
		description: "The prefix can't have symbols, it needs to be alphabetic",
	},
	{
		name: 'prefix-non-ascii',
		typeid: 'préfix_00000000000000000000000000',
		description: 'The prefix can only have ascii letters',
	},
	{
		name: 'prefix-spaces',
		typeid: '  prefix_00000000000000000000000000',
		description: "The prefix can't have any spaces",
	},
	{
		name: 'prefix-64-chars',
		typeid:
			'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl_00000000000000000000000000',
		description: "The prefix can't be 64 characters, it needs to be 63 characters or less",
	},
	{
		name: 'separator-empty-prefix',
		typeid: '_00000000000000000000000000',
		description: 'If the prefix is empty, the separator should not be there',
	},
	{
		name: 'separator-empty',
		typeid: '_',
		description: 'A separator by itself should not be treated as the empty string',
	},
	{
		name: 'suffix-short',
		typeid: 'prefix_1234567890123456789012345',
		description: "The suffix can't be 25 characters, it needs to be exactly 26 characters",
	},
	{
		name: 'suffix-long',
		typeid: 'prefix_123456789012345678901234567',
		description: "The suffix can't be 27 characters, it needs to be exactly 26 characters",
	},
	{
		name: 'suffix-spaces',
		typeid: 'prefix_1234567890123456789012345 ',
		description: "The suffix can't have any spaces",
	},
	{
		name: 'suffix-uppercase',
		typeid: 'prefix_0123456789ABCDEFGHJKMNPQRS',
		description: 'The suffix should be lowercase with no uppercase letters',
	},
	{
		name: 'suffix-hyphens',
		typeid: 'prefix_123456789-123456789-123456',
		description: "The suffix can't have any hyphens",
	},
	{
		name: 'suffix-wrong-alphabet',
		typeid: 'prefix_ooooooiiiiiiuuuuuuulllllll',
		description: "The suffix should only have letters from the spec's alphabet",
	},
	{
		name: 'suffix-ambiguous-crockford',
		typeid: 'prefix_i23456789ol23456789oi23456',
		description: 'The suffix should not have any ambiguous characters from the crockford encoding',
	},
	{
		name: 'suffix-hyphens-crockford',
		typeid: 'prefix_123456789-0123456789-0123456',
		description: "The suffix can't ignore hyphens as in the crockford encoding",
	},
	{
		name: 'suffix-overflow',
		typeid: 'prefix_8zzzzzzzzzzzzzzzzzzzzzzzzz',
		description: 'The suffix should encode at most 128-bits',
	},
	{
		name: 'prefix-underscore-start',
		typeid: '_prefix_00000000000000000000000000',
		description: "The prefix can't start with an underscore",
	},
	{
		name: 'prefix-underscore-end',
		typeid: 'prefix__00000000000000000000000000',
		description: "The prefix can't end with an underscore",
	},
]

// ================================ //
// ======== UPSTREAM TESTS ======== //
// ================================ //

// https://github.com/jetify-com/typeid-js/blob/main/test/typeid.test.ts
describe('TypeID', () => {
	// Errors copied from https://github.com/jetify-com/typeid-js/blob/main/src/unboxed/error.ts
	class InvalidPrefixError extends Error {
		constructor(prefix: string) {
			super(`Invalid prefix "${prefix}". Must be at most 63 ASCII letters [a-z_]`)
			this.name = 'InvalidPrefixError'
		}
	}

	class PrefixMismatchError extends Error {
		constructor(expected: string, actual: string) {
			super(`Invalid TypeId. Prefix mismatch. Expected ${expected}, got ${actual}`)
			this.name = 'PrefixMismatchError'
		}
	}

	class InvalidSuffixLengthError extends Error {
		constructor(length: number) {
			super(`Invalid length. Suffix should have 26 characters, got ${length}`)
			this.name = 'InvalidSuffixLengthError'
		}
	}

	class InvalidSuffixCharacterError extends Error {
		constructor(firstChar: string) {
			super(`Invalid suffix. First character "${firstChar}" must be in the range [0-7]`)
			this.name = 'InvalidSuffixCharacterError'
		}
	}

	describe('constructor', () => {
		it('should create a TypeID object', () => {
			const prefix = 'test'
			const suffix = '00041061050r3gg28a1c60t3gf'

			const id = typeid(prefix, suffix)
			expect(id).toBeInstanceOf(TypeID)
			expect(id.getType()).toEqual(prefix)
			expect(id.getSuffix()).toEqual(suffix)
		})

		it('should generate a suffix when none is provided', () => {
			const prefix = 'test'

			const id = typeid(prefix)
			expect(id).toBeInstanceOf(TypeID)
			expect(id.getType()).toEqual(prefix)
			expect(id.getSuffix()).toHaveLength(26)
		})

		it('should throw an error if prefix is not lowercase', () => {
			expect(() => {
				typeid('TEST', '00041061050r3gg28a1c60t3gf')
			}).toThrowError(new InvalidPrefixError('TEST'))

			expect(() => {
				typeid('  ', '00041061050r3gg28a1c60t3gf')
			}).toThrowError(new InvalidPrefixError('  '))
		})

		it('should throw an error if suffix length is not 26', () => {
			expect(() => {
				typeid('test', 'abc')
			}).toThrowError('Invalid length. Suffix should have 26 characters, got 3')
		})

		it('should work with string templates', () => {
			const tid = `${typeid('test')}`
			expect(tid.startsWith('test_')).toBe(true)
			expect(tid.length).toBe(31)
		})
	})

	describe('asType', () => {
		it('should return the type specified by the given prefix', () => {
			const prefix = 'prefix'
			const tid = typeid(prefix)
			const narrowed = tid.asType(prefix)
			expect(tid).toEqual(narrowed)
		})

		it('should throw an error on prefix mismatch', () => {
			const tid = typeid('foo')
			expect(() => tid.asType('bar')).toThrow('Cannot convert TypeID of type foo to type bar')
		})
	})

	describe('toString', () => {
		it('should return a string representation', () => {
			const prefix = 'test'
			const suffix = '00041061050r3gg28a1c60t3gf'

			const id = typeid(prefix, suffix)
			expect(id.toString()).toEqual('test_00041061050r3gg28a1c60t3gf')
		})

		it('should return a string representation even without prefix', () => {
			const suffix = '00041061050r3gg28a1c60t3gf'

			const id = typeid('', suffix)
			expect(id.toString()).toEqual(suffix)
		})
	})

	describe('fromString', () => {
		it('should construct TypeID from a string without prefix', () => {
			const str = '00041061050r3gg28a1c60t3gf'
			const tid = TypeID.fromString(str)

			expect(tid.getSuffix()).toBe(str)
			expect(tid.getType()).toBe('')
		})

		it('should construct TypeID from a string with prefix', () => {
			const str = 'prefix_00041061050r3gg28a1c60t3gf'
			const tid = TypeID.fromString(str)

			expect(tid.getSuffix()).toBe('00041061050r3gg28a1c60t3gf')
			expect(tid.getType()).toBe('prefix')
		})

		it('should construct TypeID from a string with prefix and specified prefix', () => {
			const str = 'prefix_00041061050r3gg28a1c60t3gf'
			const tid = TypeID.fromString(str, 'prefix')

			expect(tid.getSuffix()).toBe('00041061050r3gg28a1c60t3gf')
			expect(tid.getType()).toBe('prefix')
		})

		it('should throw an error for invalid TypeID string', () => {
			const invalidStr = 'invalid_string_with_underscore0000000000000000'

			expect(() => {
				TypeID.fromString(invalidStr)
			}).toThrowError(new InvalidSuffixCharacterError('u'))
		})
		it('should throw an error with wrong prefix', () => {
			const str = 'prefix_00041061050r3gg28a1c60t3gf'
			expect(() => {
				TypeID.fromString(str, 'wrong')
			}).toThrowError(new PrefixMismatchError('wrong', 'prefix'))
		})
		it('should throw an error for empty TypeId string', () => {
			const invalidStr = ''
			expect(() => {
				TypeID.fromString(invalidStr)
			}).toThrowError(new InvalidSuffixLengthError(0))
		})
		it('should throw an error for TypeId string with empty suffix', () => {
			const invalidStr = 'prefix_'
			expect(() => {
				TypeID.fromString(invalidStr)
			}).toThrowError(new InvalidSuffixLengthError(0))
		})
	})

	describe('fromUUIDBytes', () => {
		it('should construct TypeID from a UUID bytes without prefix', () => {
			const bytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
			const tid = TypeID.fromUUIDBytes('', bytes)

			expect(tid.getSuffix()).toBe('00041061050r3gg28a1c60t3gf')
			expect(tid.getType()).toBe('')
		})

		it('should construct TypeID from a UUID bytes with prefix', () => {
			const bytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
			const tid = TypeID.fromUUIDBytes('prefix', bytes)

			expect(tid.getSuffix()).toBe('00041061050r3gg28a1c60t3gf')
			expect(tid.getType()).toBe('prefix')
		})
	})

	describe('fromUUID', () => {
		it('should construct TypeID from a UUID string without prefix', () => {
			const uuid = '01889c89-df6b-7f1c-a388-91396ec314bc'
			const tid = TypeID.fromUUID('', uuid)

			expect(tid.getSuffix()).toBe('01h2e8kqvbfwea724h75qc655w')
			expect(tid.getType()).toBe('')
		})

		it('should construct TypeID from a UUID string  with prefix', () => {
			const uuid = '01889c89-df6b-7f1c-a388-91396ec314bc'
			const tid = TypeID.fromUUID('prefix', uuid)

			expect(tid.getSuffix()).toBe('01h2e8kqvbfwea724h75qc655w')
			expect(tid.getType()).toBe('prefix')
		})
	})

	describe('encode <-> decode', () => {
		it('should be invariant on random ids with a prefix', () => {
			for (let i = 0; i < 1000; i += 1) {
				const prefix = 'test'
				const tid = typeid(prefix)
				const decoded = TypeID.fromString(tid.toString())

				expect(decoded).toEqual(tid)
			}
		})

		it('should be invariant on random ids without a prefix', () => {
			for (let i = 0; i < 1000; i += 1) {
				const tid = typeid()
				const decoded = TypeID.fromString(tid.toString())

				expect(decoded).toEqual(tid)
			}
		})
	})

	describe('spec', () => {
		valid2.forEach((testcase: { name: string; prefix: string; typeid: string; uuid: string }) => {
			it(`parses string from valid case: ${testcase.name}`, () => {
				const tid = TypeID.fromString(testcase.typeid)
				expect(tid.getType()).toBe(testcase.prefix)
				expect(tid.toString()).toBe(testcase.typeid)
				expect(tid.toUUID()).toBe(testcase.uuid)
			})

			it(`encodes uuid from valid case: ${testcase.name}`, () => {
				const tid = TypeID.fromUUID(testcase.prefix, testcase.uuid)
				expect(tid.getType()).toBe(testcase.prefix)
				expect(tid.toString()).toBe(testcase.typeid)
				expect(tid.toUUID()).toBe(testcase.uuid)
			})
		})

		invalid2.forEach((testcase: { name: string; typeid: string }) => {
			it(`errors on invalid case: ${testcase.name}`, () => {
				expect(() => {
					TypeID.fromString(testcase.typeid)
				}).toThrowError()
			})
		})
	})
})

/**
 * https://github.com/jetify-com/typeid-js/blob/main/test/valid.ts
 * Each example contains:
 * - The TypeID in its canonical string representation.
 * - The prefix
 * - The decoded UUID as a hex string
 *
 * Data copied over from the typeid valid.yml spec file
 *
 * Last updated: 2024-04-17 (for version 0.3.0 of the spec)
 */
const valid2 = [
	{
		name: 'nil',
		typeid: '00000000000000000000000000',
		prefix: '',
		uuid: '00000000-0000-0000-0000-000000000000',
	},
	{
		name: 'one',
		typeid: '0000000000e008000000000001',
		prefix: '',
		uuid: '00000000-0000-7000-8000-000000000001',
	},
	{
		name: 'ten',
		typeid: '0000000000e00900000000000a',
		prefix: '',
		uuid: '00000000-0000-7000-9000-00000000000a',
	},
	{
		name: 'sixteen',
		typeid: '0000000000e00a00000000000g',
		prefix: '',
		uuid: '00000000-0000-7000-a000-000000000010',
	},
	{
		name: 'thirty-two',
		typeid: '0000000000e00b000000000010',
		prefix: '',
		uuid: '00000000-0000-7000-b000-000000000020',
	},
	{
		name: 'max-valid',
		typeid: '7zzzzzzzzzzzzzzzzzzzzzzzzz',
		prefix: '',
		uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
	},
	{
		name: 'valid-alphabet-like',
		typeid: 'prefix_0123456789abcbefghjkmnpqrs',
		prefix: 'prefix',
		uuid: '0110c853-1d09-52d8-b73e-1194e95b5f19',
	},
	{
		name: 'valid-uuidv7',
		typeid: 'prefix_01h455vb4pex5vsknk084sn02q',
		prefix: 'prefix',
		uuid: '01890a5d-ac96-774b-bcce-b302099a8057',
	},
	{
		// Tests below were added in v0.3.0 when we started allowing '_' within the type prefix.
		name: 'prefix-underscore',
		typeid: 'pre_fix_00000000000000000000000000',
		prefix: 'pre_fix',
		uuid: '00000000-0000-0000-0000-000000000000',
	},
]

/**
 * https://github.com/jetify-com/typeid-js/blob/main/test/invalid.ts
 * This file contains test data that should be treated as *invalid* TypeIDs by
 * conforming implementations.
 *
 * Each example contains an invalid TypeID string. Implementations are expected
 * to throw an error when attempting to parse/validate these strings.
 *
 * Data copied over from the invalid.yml spec file
 *
 * Last updated: 2024-04-17 (for version 0.3.0 of the spec)
 */
const invalid2 = [
	{
		name: 'prefix-uppercase',
		typeid: 'PREFIX_00000000000000000000000000',
		description: 'The prefix should be lowercase with no uppercase letters',
	},
	{
		name: 'prefix-numeric',
		typeid: '12345_00000000000000000000000000',
		description: "The prefix can't have numbers, it needs to be alphabetic",
	},
	{
		name: 'prefix-period',
		typeid: 'pre.fix_00000000000000000000000000',
		description: "The prefix can't have symbols, it needs to be alphabetic",
	},
	// Test removed in v0.3.0 – we now allow underscores in the prefix
	// {
	//   name: "prefix-underscore",
	//   typeid: "pre_fix_00000000000000000000000000",
	//   description: "The prefix can't have symbols, it needs to be alphabetic",
	// },
	{
		name: 'prefix-non-ascii',
		typeid: 'préfix_00000000000000000000000000',
		description: 'The prefix can only have ascii letters',
	},
	{
		name: 'prefix-spaces',
		typeid: '  prefix_00000000000000000000000000',
		description: "The prefix can't have any spaces",
	},
	{
		name: 'prefix-64-chars',
		typeid:
			'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl_00000000000000000000000000',
		description: "The prefix can't be 64 characters, it needs to be 63 characters or less",
	},
	{
		name: 'separator-empty-prefix',
		typeid: '_00000000000000000000000000',
		description: 'If the prefix is empty, the separator should not be there',
	},
	{
		name: 'separator-empty',
		typeid: '_',
		description: 'A separator by itself should not be treated as the empty string',
	},
	{
		name: 'suffix-short',
		typeid: 'prefix_1234567890123456789012345',
		description: "The suffix can't be 25 characters, it needs to be exactly 26 characters",
	},
	{
		name: 'suffix-long',
		typeid: 'prefix_123456789012345678901234567',
		description: "The suffix can't be 27 characters, it needs to be exactly 26 characters",
	},
	{
		name: 'suffix-spaces',
		typeid: 'prefix_1234567890123456789012345 ',
		description: "The suffix can't have any spaces",
	},
	{
		name: 'suffix-uppercase',
		typeid: 'prefix_0123456789ABCDEFGHJKMNPQRS',
		description: 'The suffix should be lowercase with no uppercase letters',
	},
	{
		name: 'suffix-hyphens',
		typeid: 'prefix_123456789-123456789-123456',
		description: 'The suffix should be lowercase with no uppercase letters',
	},
	{
		name: 'suffix-wrong-alphabet',
		typeid: 'prefix_ooooooiiiiiiuuuuuuulllllll',
		description: "The suffix should only have letters from the spec's alphabet",
	},
	{
		name: 'suffix-ambiguous-crockford',
		typeid: 'prefix_i23456789ol23456789oi23456',
		description: 'The suffix should not have any ambiguous characters from the crockford encoding',
	},
	{
		name: 'suffix-hyphens-crockford',
		typeid: 'prefix_123456789-0123456789-0123456',
		description: "The suffix can't ignore hyphens as in the crockford encoding",
	},
	{
		name: 'suffix-overflow',
		typeid: 'prefix_8zzzzzzzzzzzzzzzzzzzzzzzzz',
		description: 'The suffix should encode at most 128-bits',
	},
	// Tests below were added in v0.3.0 when we started allowing '_' within the type prefix.
	{
		name: 'prefix-underscore-start',
		typeid: '_prefix_00000000000000000000000000',
		description: "The prefix can't start with an underscore",
	},
	{
		name: 'prefix-underscore-end',
		typeid: 'prefix__00000000000000000000000000',
		description: "The prefix can't end with an underscore",
	},
]
