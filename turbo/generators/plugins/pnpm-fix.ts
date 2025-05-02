import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'
import { slugifyText } from '../helpers/slugify'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../types'

export function pnpmFix(answers: Answers, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, reject) => {
		console.log('🌀 running pnpm fix...')

		$({
			cwd: answers.turbo.paths.root,
			nothrow: true,
		})`FIX_ESLINT=1 pnpm -F ${slugifyText(answers.name)} check:lint && pnpm runx fix --deps --format --workers-types`
			.then(onProcSuccess('pnpm fix', resolve, reject))
			.catch(catchError(reject))
	})
}
