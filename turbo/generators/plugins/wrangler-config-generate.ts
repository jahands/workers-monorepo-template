import path from 'node:path'
import { $ } from 'zx'

import { catchError, onProcSuccess } from '../helpers/proc'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../answers'

export type WranglerConfigGenerateData = Answers & {
	/** Worker directory, relative to the workspace root */
	destination: string
}

export function wranglerConfigGenerate(
	data: WranglerConfigGenerateData,
	_config: any,
	_plop: PlopTypes.NodePlopAPI
) {
	return new Promise((resolve, reject) => {
		console.log('🌀 generating wrangler.jsonc')

		$({
			cwd: path.join(data.turbo.paths.root, data.destination),
			nothrow: true,
		})`pnpm run build:wrangler-config`
			.then(onProcSuccess('wrangler-config', resolve, reject))
			.catch(catchError(reject))
	})
}
