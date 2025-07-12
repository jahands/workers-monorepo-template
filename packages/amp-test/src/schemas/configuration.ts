import { z } from 'zod/v4'

/** Configuration schema that rejects extra properties */
export type Configuration = z.infer<typeof Configuration>
export const Configuration = z.strictObject({
	apiKey: z.string(),
	timeout: z.number(),
	retries: z.number(),
})
