import { z } from 'zod/v4'

/** Event with date and timestamp fields */
export type Event = z.infer<typeof Event>
export const Event = z.object({
	startDate: z.iso.date(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().optional(),
})
