import { z } from 'zod/v4'

/** Game statistics data */
export type GameStats = z.infer<typeof GameStats>
export const GameStats = z.object({
	score: z.number(),
	lives: z.int(),
	precision: z.int32(),
	accuracy: z.float64(),
})
