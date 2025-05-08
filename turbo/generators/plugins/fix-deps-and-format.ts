import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../answers'

export function fixDepsAndFormat(answers: Answers, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, reject) => {
		console.log('🌀 running pnpm runx fix --deps --format')

		$({
			cwd: answers.turbo.paths.root,
			nothrow: true,
			quiet: true,
		})`pnpm runx fix --deps --format`
			.then(onProcSuccess('pnpm runx fix', resolve, reject))
			.catch(catchError(reject))
	})
}
