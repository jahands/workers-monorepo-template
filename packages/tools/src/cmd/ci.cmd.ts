import { Command } from '@commander-js/extra-typings'

import type { Options as ZXOptions } from 'zx'

export const ciCmd = new Command('ci').description('Scripts used in CI')

function opts(): Partial<ZXOptions> {
	return {
		verbose: true,
		env: {
			FORCE_COLOR: '1',
			...process.env,
		},
	}
}

ciCmd
	.command('check')
	.description('Run CI checks')
	.action(async () => {
		await $(opts())`bun turbo check:ci`
	})

ciCmd
	.command('install-deps')
	.description('Install dependencies')
	.action(async () => {
		await $(opts())`pnpm install --frozen-lockfile --child-concurrency=10`
	})
