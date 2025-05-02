import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../types'

export function pnpmInstall(answers: Answers, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, reject) => {
		console.log('🌀 running pnpm install...')

		$({
			cwd: answers.turbo.paths.root,
			nothrow: true,
		})`pnpm install --child-concurrency=10`
			.then(onProcSuccess('pnpm install', resolve, reject))
			.catch(catchError(reject))
	})
}
