import { cliError } from '@jahands/cli-tools/errors'
import * as z from 'zod'

import { getWranglerConfig } from './config'
import { fileExists, readJsonFile } from './fs'
import { getWranglerJsoncPath } from './path'

export async function generateWranglerJsonc(): Promise<void> {
	const config = await getWranglerConfig()
	const wranglerJsoncPath = getWranglerJsoncPath()

	let currentConfig: string | null = null
	if (await fileExists(wranglerJsoncPath)) {
		currentConfig = JSON.stringify(
			z.looseObject({}).parse(await readJsonFile(wranglerJsoncPath)),
			null,
			'\t'
		)
	}

	const newConfig = JSON.stringify(config, null, '\t')

	// only update if the config has changed to avoid unnecessary formatting
	if (newConfig !== currentConfig) {
		await fs.writeFile(wranglerJsoncPath, newConfig, 'utf8')
		echo(chalk.green('wrangler.jsonc updated'))
	} else {
		echo(chalk.green('wrangler.jsonc is up to date'))
	}
}

export async function checkWranglerJsonc(): Promise<void> {
	const config = await getWranglerConfig()
	const wranglerJsoncPath = getWranglerJsoncPath()

	// note: looseObject is used to ensure keys are sorted consistently
	const jsoncConfig = z.looseObject({}).parse(await readJsonFile(wranglerJsoncPath))
	const matches = JSON.stringify(config) === JSON.stringify(jsoncConfig)
	if (!matches) {
		throw cliError(
			'wrangler.config.ts does not match wrangler.jsonc - run `wrangler-config generate` to update wrangler.jsonc'
		)
	}
	echo(chalk.green('wrangler.jsonc is up to date'))
}
