import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'
import { slugifyText } from '../helpers/slugify'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../types'

export function wranglerSecretPut(
	answers: Answers,
	config: { data: { name: string } },
	_plop: PlopTypes.NodePlopAPI
) {
	return new Promise((resolve, reject) => {
		console.log(`Enter secret for ${config.data.name}`)

		$({
			cwd: `${answers.turbo.paths.root}/${answers.appsDir}/${slugifyText(answers.name)}`,
			nothrow: true,
			stdio: 'inherit',
		})`pnpm exec wrangler secret put ${config.data.name}`
			.then(onProcSuccess('wrangler', resolve, reject))
			.catch(catchError(reject))
	})
}
