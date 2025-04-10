import { z } from 'zod'

/**
 * Number that can be 0 or more (i.e. non-negative)
 */
export function numberMin0(params?: Parameters<typeof z.number>[0]) {
	return z.number(params).min(0)
}
