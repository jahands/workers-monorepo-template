import { z } from 'zod/v4'

/** Product code validation schema */
export type ProductCode = z.infer<typeof ProductCode>
export const ProductCode = z
	.string()
	.length(12)
	.check((val) => val.startsWith('PROD-'), {
		error: 'Must start with PROD-',
	})
	.check((val) => /^PROD-[A-Z0-9]{7}$/.test(val), {
		error: 'Must contain only uppercase letters and numbers after prefix',
	})
