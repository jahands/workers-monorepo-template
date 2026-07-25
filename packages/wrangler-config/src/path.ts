import { existsSync } from 'node:fs'
import path from 'node:path'
import { cliError } from '@jahands/cli-tools'

export function getWranglerJsoncPath(): string {
	return path.join(path.dirname(getWranglerConfigPath()), 'wrangler.jsonc')
}

export function getWranglerConfigPath(): string {
	const wranglerConfigPath = path.resolve(process.cwd(), 'wrangler.config.ts')
	if (!existsSync(wranglerConfigPath)) {
		throw cliError('wrangler.config.ts not found in the current directory')
	}
	return wranglerConfigPath
}
