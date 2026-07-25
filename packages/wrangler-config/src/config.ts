import { pathToFileURL } from 'node:url'
import { cliError } from '@jahands/cli-tools'
import * as z from 'zod'

import { getWranglerConfigPath } from './path'
import { WranglerConfig } from './schema'
import { WranglerConfigWithDefaults, wranglerContext } from './wrangler.defaults'

import type { DefineConfigContext, WranglerConfigInput } from './wrangler.defaults'

export type DefineConfigFn = (
	c: DefineConfigContext
) => WranglerConfigInput | Promise<WranglerConfigInput>

// TODO: pass in config object as first param to allow us to easily
// reuse worker name in the callback (for things like main)
export async function defineConfig(fn: DefineConfigFn): Promise<WranglerConfig> {
	try {
		return WranglerConfigWithDefaults.decode(await fn(wranglerContext))
	} catch (e) {
		if (e instanceof z.ZodError) {
			throw new Error(`Invalid wrangler.config.ts: ${z.prettifyError(e)}`)
		}
		throw e
	}
}

export async function getWranglerConfig(): Promise<WranglerConfig> {
	const wranglerConfigPath = getWranglerConfigPath()

	const mod = await import(pathToFileURL(wranglerConfigPath).href)
	if (!('default' in mod)) {
		throw cliError('wrangler.config.ts must export a default export, but no default export found')
	}
	if (typeof mod.default !== 'object') {
		throw cliError(
			`wrangler.config.ts must export a default export that is an object, but got ${typeof mod.default}`
		)
	}

	return await WranglerConfig.decodeAsync(await mod.default).catch((e) => {
		if (e instanceof z.ZodError) {
			throw cliError(`Invalid wrangler.config.ts: ${z.prettifyError(e)}`)
		}
		throw e
	})
}
