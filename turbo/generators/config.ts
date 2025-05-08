import {
	pascalText,
	pascalTextPlural,
	pascalTextSingular,
	slugifyText,
	slugifyTextPlural,
	slugifyTextSingular,
} from './helpers/slugify'
import { nameValidator } from './helpers/validate'
import { fixAll } from './plugins/fix-all'
import { fixDepsAndFormat } from './plugins/fix-deps-and-format'
import { pnpmInstall } from './plugins/pnpm-install'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from './types'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setActionType('pnpmInstall', pnpmInstall as PlopTypes.CustomActionFunction)
	plop.setActionType('fixAll', fixAll as PlopTypes.CustomActionFunction)
	plop.setActionType('fixDepsAndFormat', fixDepsAndFormat as PlopTypes.CustomActionFunction)

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
				validate: nameValidator,
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
				{ type: 'fixAll' },
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
				validate: nameValidator,
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
				{ type: 'fixAll' },
				{ type: 'pnpmInstall' },
			]

			return actions
		},
	})

	plop.setGenerator('new-package', {
		description: 'Create a new shared package',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'name of package',
				validate: nameValidator,
			},
			{
				type: 'confirm',
				name: 'usedInWorkers',
				message: 'Will this package be used within Cloudflare Workers?',
				default: true,
			},
		],
		actions: (data: any) => {
			const answers = data as Answers
			process.chdir(answers.turbo.paths.root)

			// Determine tsconfigType based on usedInWorkers
			answers.tsconfigType = answers.usedInWorkers ? 'workers-lib.json' : 'lib.json'

			const actions: PlopTypes.Actions = [
				{
					type: 'addMany',
					base: 'templates/package',
					destination: `packages/{{ slug name }}`,
					templateFiles: ['templates/package/**/**.hbs', 'templates/package/.eslintrc.cjs.hbs'],
				},
				{ type: 'fixDepsAndFormat' },
				{ type: 'pnpmInstall' },
			]

			return actions
		},
	})
}
