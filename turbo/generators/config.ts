import {
	pascalText,
	pascalTextPlural,
	pascalTextSingular,
	slugifyText,
	slugifyTextPlural,
	slugifyTextSingular,
} from './helpers/slugify'
import { pnpmFix } from './plugins/pnpm-fix'
import { pnpmInstall } from './plugins/pnpm-install'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from './types'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setActionType('pnpmInstall', pnpmInstall as PlopTypes.CustomActionFunction)
	plop.setActionType('pnpmFix', pnpmFix as PlopTypes.CustomActionFunction)

	plop.setHelper('slug', slugifyText)
	plop.setHelper('slug-s', slugifyTextSingular)
	plop.setHelper('slug-p', slugifyTextPlural)

	plop.setHelper('pascal', pascalText)
	plop.setHelper('pascal-s', pascalTextSingular)
	plop.setHelper('pascal-p', pascalTextPlural)

	plop.setGenerator('new-worker', {
		description: 'Create a new Cloudflare Worker using Hono',
		// gather information from the user
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'name of worker',
			},
		],
		// perform actions based on the prompts
		actions: (data: any) => {
			const answers = data as Answers
			process.chdir(answers.turbo.paths.root)

			const actions: PlopTypes.Actions = [
				{
					type: 'addMany',
					base: 'templates/fetch-worker',
					destination: `apps/{{ slug name }}`,
					templateFiles: [
						'templates/fetch-worker/**/**.hbs',
						'templates/fetch-worker/.eslintrc.cjs.hbs',
					],
				},
				{ type: 'pnpmInstall' },
				{ type: 'pnpmFix' },
				{ type: 'pnpmInstall' },
			]

			return actions
		},
	})

	plop.setGenerator('new-worker-vite', {
		description: 'Create a new Cloudflare Worker using Hono and Vite',
		// gather information from the user
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'name of worker',
			},
		],
		// perform actions based on the prompts
		actions: (data: any) => {
			const answers = data as Answers
			process.chdir(answers.turbo.paths.root)

			const actions: PlopTypes.Actions = [
				{
					type: 'addMany',
					base: 'templates/fetch-worker-vite',
					destination: `apps/{{ slug name }}`,
					templateFiles: [
						'templates/fetch-worker-vite/**/**.hbs',
						'templates/fetch-worker-vite/.eslintrc.cjs.hbs',
					],
				},
				{ type: 'pnpmInstall' },
				{ type: 'pnpmFix' },
				{ type: 'pnpmInstall' },
			]

			return actions
		},
	})
}
