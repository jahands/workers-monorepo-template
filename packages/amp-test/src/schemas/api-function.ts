import { z } from 'zod/v4'

/** Options for user profile retrieval */
export type UserProfileOptions = z.infer<typeof UserProfileOptions>
export const UserProfileOptions = z.object({
	includePreferences: z.boolean().optional(),
	fields: z.array(z.string()).optional(),
})

/** User profile response */
export type UserProfile = z.infer<typeof UserProfile>
export const UserProfile = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
})

/** Function to get user profile by ID */
export type GetUserProfile = z.infer<typeof GetUserProfile>
export const GetUserProfile = z.function({
	input: [z.string(), UserProfileOptions],
	output: UserProfile,
})
