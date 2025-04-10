import { Command } from '@commander-js/extra-typings'

import { z } from '@repo/zod'

export const workflowsCmd = new Command('workflows').description(
	'Helpers for Workers that utilize Workflows'
)

workflowsCmd
	.command('get-api-tokens')
	.description(
		'Get API tokens from 1Password and format them as JSON for writing to Workers Secrets'
	)
	.action(async () => {
		echo(await getApiTokens())
	})

workflowsCmd
	.command('write-api-tokens')
	.description('Get API tokens from 1Password and write them to API_TOKENS')
	.action(async () => {
		const tokens = z
			.string()
			.min(1)
			.parse(await getApiTokens())

		const proc = $`wrangler secret put API_TOKENS`.verbose()
		proc.stdin.write(tokens)
		proc.stdin.end()
		await proc
	})

async function getApiTokens(): Promise<string> {
	const itemId = 'an7cbmr3ty2ggvfepyfyi5h3lu' // 1P-2ufft: workflows.uuid.rocks api tokens
	const sectionId = 'd5maloh75u5n6kovlb2zijt7ae' // API Tokens
	const item = OPItem.parse(await $`op item get --format json ${itemId}`.json())
	const tokenFields = item.fields.filter(
		(f) => f.section?.id === sectionId && f.type === 'CONCEALED'
	)
	const tokens: Record<string, string> = {}
	for (const field of tokenFields) {
		if (!field.value) {
			continue
		}
		const name = z
			.string()
			.trim()
			.transform((s) => s.split(' ')[0])
			.pipe(z.string().regex(/^[a-z0-9_-]+$/))
			.parse(field.label.split(' ')[0])
		tokens[name] = z.string().min(1).parse(field.value)
	}
	return JSON.stringify(tokens)
}

const OPField = z.object({
	id: z.string(),
	type: z.string(),
	label: z.string(),
	value: z.string().optional(),
	section: z
		.object({
			id: z.string(),
		})
		.optional(),
})

const OPItem = z.object({
	id: z.string(),
	fields: OPField.array(),
})
