import { $ } from '@repo/workspace-dependencies/zx'

import { catchError, onProcSuccess } from '../helpers/proc'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../answers'

export type PnpmInstallData = Answers & { destination: string }

export function pnpmInstall(data: PnpmInstallData, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, reject) => {
		console.log('🌀 running pnpm install')

		$({
			cwd: data.turbo.paths.root,
			nothrow: true,
		})`pnpm install --child-concurrency=10 -F ./${data.destination}`
			.then(onProcSuccess('pnpm install', resolve, reject))
			.catch(catchError(reject))
	})
}
