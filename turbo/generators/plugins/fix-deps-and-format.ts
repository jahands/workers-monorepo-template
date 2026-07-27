import { $ } from 'zx'

import { catchError, onProcSuccess } from '../helpers/proc'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../answers'

/**
 * Align generated package deps with syncpack, install, then format.
 *
 * Order matters:
 * 1. `bun runx fix --deps` — use bun (not pnpm) so we don't hit
 *    `verifyDepsBeforeRun` after addMany added a new workspace package.
 * 2. `pnpm install` — sync node_modules after syncpack rewrites versions /
 *    the new package joins the workspace.
 * 3. `bun runx fix --format` — format only after install so turbo tasks don't
 *    race concurrent auto-installs.
 */
export function fixDepsAndFormat(answers: Answers, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, reject) => {
		console.log('🌀 running fix --deps, pnpm install, fix --format')

		$({
			cwd: answers.turbo.paths.root,
			nothrow: true,
		})`bun runx fix --deps && pnpm install --child-concurrency=10 && bun runx fix --format`
			.then(onProcSuccess('fix deps/install/format', resolve, reject))
			.catch(catchError(reject))
	})
}
