import { parse } from 'jsonc-parser/lib/esm/main.js'

import type { ParseError } from 'jsonc-parser/lib/esm/main.js'

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath)
		return true
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return false
		}
		throw error
	}
}

export async function readJsonFile(filePath: string): Promise<unknown> {
	const contents = await fs.readFile(filePath, 'utf8')
	const errors: ParseError[] = []
	const parsed = parse(contents, errors)
	if (errors.length > 0) {
		throw new Error(`Failed to parse ${filePath} as JSONC`)
	}
	return parsed
}
