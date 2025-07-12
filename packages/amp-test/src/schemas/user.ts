import { z } from 'zod/v4'

/** User object with email, name, and age validation */
export type User = z.infer<typeof User>
export const User = z.object({
	email: z.email(),
	name: z.string().min(2),
	age: z.number().min(18),
})
