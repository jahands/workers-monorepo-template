import { z } from 'zod/v4'

/** Password with security requirements */
export type Password = z.infer<typeof Password>
export const Password = z
	.string()
	.min(8)
	.check((val) => /[A-Z]/.test(val), {
		error: 'Must contain uppercase letter',
	})
	.check((val) => /\d/.test(val), {
		error: 'Must contain number',
	})
	.check((val) => /[^a-zA-Z0-9]/.test(val), {
		error: 'Must contain special character',
	})
