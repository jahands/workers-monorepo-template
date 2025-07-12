import { z } from 'zod/v4'

/** File information for upload */
export type FileInfo = z.infer<typeof FileInfo>
export const FileInfo = z.object({
	name: z.string(),
	size: z.number().min(1).max(10 * 1024 * 1024), // 1 byte to 10MB
	type: z.string().refine(
		(type) => type.startsWith('image/') || type.startsWith('application/') || type.startsWith('text/'),
		{ error: 'Invalid MIME type' }
	),
})

/** Upload metadata */
export type UploadMetadata = z.infer<typeof UploadMetadata>
export const UploadMetadata = z.object({
	uploadedBy: z.string(),
})

/** File upload request */
export type FileUpload = z.infer<typeof FileUpload>
export const FileUpload = z.object({
	files: z.array(FileInfo).min(1),
	metadata: UploadMetadata.optional(),
	tags: z.array(z.string()).nullable(),
	maxRetries: z.number().int().min(0).default(3),
})
