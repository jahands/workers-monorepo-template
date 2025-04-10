import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'
import { slugifyText } from '../helpers/slugify'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../types'

export function writeWorkflowsApiTokens(
	answers: Answers,
	_config: unknown,
	_plop: PlopTypes.NodePlopAPI
) {
	return new Promise((resolve, reject) => {
		$({
			cwd: answers.turbo.paths.root,
			nothrow: true,
		})`'pnpm -F ${slugifyText(answers.name)} write-api-tokens`
			.then(onProcSuccess('pnpm write-api-tokens', resolve, reject))
			.catch(catchError(reject))
	})
}
