#!/usr/bin/env node

import 'zx/globals'

import { Command } from '@commander-js/extra-typings'
import { catchProcessError } from '@jahands/cli-tools'
import * as z from 'zod'

import { checkWranglerJsonc, generateWranglerJsonc } from '../cli'

const isCI = () => z.stringbool().safeParse(process.env.CI).success

export const program = new Command('wrangler-config')
	.description('Commands for working with wrangler.config.ts and wrangler.jsonc')
	.option('--skip-in-ci', 'Skip checks in CI')
	.action(async ({ skipInCi }) => {
		if (isCI()) {
			if (skipInCi) {
				return
			}

			await checkWranglerJsonc()
		} else {
			await generateWranglerJsonc()
		}
	})

program
	.command('generate')
	.description('Generate wrangler.jsonc')
	.action(async () => {
		await generateWranglerJsonc()
	})

program
	.command('check')
	.description('Ensure wrangler.config.ts is valid and matches wrangler.jsonc')
	.option('--skip-in-ci', 'Skip checks in CI')
	.action(async ({ skipInCi }) => {
		if (isCI() && skipInCi) {
			return
		}

		await checkWranglerJsonc()
	})

program
	// don't hang for unresolved promises
	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch(catchProcessError())
