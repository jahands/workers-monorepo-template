import { z } from '@repo/zod'

export function getMetricsToken(): Token | null {
	const token = z.string().min(1).safeParse(process.env.UUID_INGEST_API_TOKEN)
	if (token.success) {
		return token.data
	} else {
		return null
	}
}

export type Token = z.infer<typeof Token>
export const Token = z.string().min(1)
