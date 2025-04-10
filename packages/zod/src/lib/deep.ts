import { z } from 'zod'

// Add additional deep functionality based on:
// https://github.com/colinhacks/zod/issues/2062#issuecomment-1439286556
type ZodObjectMapper<T extends z.ZodRawShape, U extends z.UnknownKeysParam> = (
	o: z.ZodObject<T>
) => z.ZodObject<T, U>

function deepApplyObject(schema: z.ZodTypeAny, map: ZodObjectMapper<any, any>): any {
	if (schema instanceof z.ZodObject) {
		const newShape: Record<string, z.ZodTypeAny> = {}
		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key]
			newShape[key] = deepApplyObject(fieldSchema, map)
		}
		const newObject = new z.ZodObject({
			...schema._def,
			shape: () => newShape,
		})
		return map(newObject)
	} else if (schema instanceof z.ZodArray) {
		return z.ZodArray.create(deepApplyObject(schema.element, map))
	} else if (schema instanceof z.ZodOptional) {
		return z.ZodOptional.create(deepApplyObject(schema.unwrap(), map))
	} else if (schema instanceof z.ZodNullable) {
		return z.ZodNullable.create(deepApplyObject(schema.unwrap(), map))
	} else if (schema instanceof z.ZodTuple) {
		return z.ZodTuple.create(schema.items.map((item: any) => deepApplyObject(item, map)))
	} else {
		return schema
	}
}

type DeepUnknownKeys<T extends z.ZodTypeAny, UnknownKeys extends z.UnknownKeysParam> =
	T extends z.ZodObject<infer Shape, infer _, infer Catchall>
		? z.ZodObject<
				{
					[k in keyof Shape]: DeepUnknownKeys<Shape[k], UnknownKeys>
				},
				UnknownKeys,
				Catchall
			>
		: T extends z.ZodArray<infer Type, infer Card>
			? z.ZodArray<DeepUnknownKeys<Type, UnknownKeys>, Card>
			: T extends z.ZodOptional<infer Type>
				? z.ZodOptional<DeepUnknownKeys<Type, UnknownKeys>>
				: T extends z.ZodNullable<infer Type>
					? z.ZodNullable<DeepUnknownKeys<Type, UnknownKeys>>
					: T extends z.ZodTuple<infer Items>
						? {
								[k in keyof Items]: Items[k] extends z.ZodTypeAny
									? DeepUnknownKeys<Items[k], UnknownKeys>
									: never
							} extends infer PI
							? PI extends z.ZodTupleItems
								? z.ZodTuple<PI>
								: never
							: never
						: T

export type DeepPassthrough<T extends z.ZodTypeAny> = DeepUnknownKeys<T, 'passthrough'>
export function deepPassthrough<T extends z.ZodTypeAny>(schema: T): DeepPassthrough<T> {
	return deepApplyObject(schema, (s) => s.passthrough()) as DeepPassthrough<T>
}

export type DeepStrip<T extends z.ZodTypeAny> = DeepUnknownKeys<T, 'strip'>
export function deepStrip<T extends z.ZodTypeAny>(schema: T): DeepStrip<T> {
	return deepApplyObject(schema, (s) => s.strip()) as DeepStrip<T>
}

/**
 * Zod error message
 * @source https://github.com/colinhacks/zod/blob/8561c9f2a1ee3721055299ec51f1a6895517b209/src/helpers/errorUtil.ts#L2
 */
type ErrMessage = string | { message?: string }

export type DeepStrict<T extends z.ZodTypeAny> = DeepUnknownKeys<T, 'strict'>
export function deepStrict<T extends z.ZodTypeAny>(schema: T, error?: ErrMessage): DeepStrict<T> {
	return deepApplyObject(schema, (s) => s.strict(error)) as DeepStrict<T>
}
