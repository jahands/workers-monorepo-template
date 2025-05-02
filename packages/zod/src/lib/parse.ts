import type { z } from 'zod'

/**
 * Type-safe version of `schema.parse()` that ensures the
 * passed in value matches the given Zod schema. Useful
 * when we are parsing non-unknown types.
 * @param schema The schema to use for parsing
 * @param value The value to parse
 * @returns Value parsed by the schema
 * @throws when value fails to parse
 */
export function parse<T extends z.ZodSchema>(schema: T, value: T['_input']): T['_output'] {
	return schema.parse(value)
}

/**
 * Type-safe version of `schema.safeParse()` that ensures the
 * passed in value matches the given Zod schema. Useful when
 * we are parsing non-unknown types.
 * @param schema The schema to use for parsing
 * @param value The value to parse
 * @returns schema.safeParse() result
 */
export function safeParse<T extends z.ZodSchema>(
	schema: T,
	value: T['_input']
): z.ZodSafeParseResult<T['_output']> {
	return schema.safeParse(value)
}

/**
 * Type-safe version of `schema.safeParseAsync()` that ensures the
 * passed in value matches the given Zod schema. Useful when we
 * are parsing non-unknown types.
 * @param schema The schema to use for parsing
 * @param value The value to parse
 * @returns schema.safeParse() result
 */
export async function safeParseAsync<T extends z.ZodSchema>(
	schema: T,
	value: T['_input']
): Promise<z.ZodSafeParseResult<T['_output']>> {
	return schema.safeParseAsync(value)
}
