import { z } from '@repo/zod'

import type { AnyStr } from './types'

/** Common hostnames (used for hints) */
export type Hostname = z.infer<typeof Hostname>
export const Hostname = z.enum(['MBP24', 'MAC5'])

/** Gets normalized hostname (without .local) */
export function getHostname(): AnyStr<Hostname> {
	return z
		.string()
		.trim()
		.regex(/^[a-zA-Z\w]+$/)
		.parse(os.hostname().split('.')[0])
}
