import { Command } from '@commander-js/extra-typings'

import { ensureDevVarsExists } from '../dev-vars'

import type { Options as ZXOptions } from 'zx'

export const devCmd = new Command('dev').description('Develop applications locally')

/** Default zx options */
const opts = {
	stdio: 'inherit',
	verbose: true,
} satisfies Partial<ZXOptions>

devCmd
	.command('wrangler')
	.description('Build packages and run wrangler dev')
	.argument(
		'[extraWranglerArgs...]',
		'Additional args to pass to wrangler dev. Recommend adding -- first'
	)
	.action(async (args) => {
		await $(opts)`bun turbo build`
		await ensureDevVarsExists()

		await $(opts)`wrangler dev ${args}`
	})
