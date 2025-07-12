import { z } from 'zod/v4'

/** Social profile with contact and identification information */
export type SocialProfile = z.infer<typeof SocialProfile>
export const SocialProfile = z.object({
	email: z.email(),
	website: z.url(),
	userId: z.uuid(),
	profileUrl: z.url(),
})
