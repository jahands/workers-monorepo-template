import { z } from 'zod/v4'

/** Author information */
export type Author = z.infer<typeof Author>
export const Author = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
})

/** Request to create a new blog post */
export type CreatePostRequest = z.infer<typeof CreatePostRequest>
export const CreatePostRequest = z.object({
	title: z.string(),
	content: z.string(),
	tags: z.string().array(),
	publishAt: z.iso.datetime(),
})

/** Blog post response */
export type PostResponse = z.infer<typeof PostResponse>
export const PostResponse = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string(),
	author: Author,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
})
