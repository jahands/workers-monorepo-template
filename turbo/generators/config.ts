import { isWorkerNameUnique } from './helpers/ensure-unique-worker-name'
import { partials } from './helpers/partials'
import {
	pascalText,
	pascalTextPlural,
	pascalTextSingular,
	slugifyText,
	slugifyTextPlural,
	slugifyTextSingular,
} from './helpers/slugify'
import { updateGitHubActions } from './plugins/github-actions'
import { pnpmFix } from './plugins/pnpm-fix'
import { pnpmInstall } from './plugins/pnpm-install'
import { wranglerSecretPut } from './plugins/wrangler-secret-put'
import { writeWorkflowsApiTokens } from './plugins/write-workflows-api-tokens'

import type { PlopTypes } from '@turbo/gen'
import type { Answers, WorkflowsAnswers } from './types'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setActionType('pnpmInstall', pnpmInstall as PlopTypes.CustomActionFunction)
	plop.setActionType('pnpmFix', pnpmFix as PlopTypes.CustomActionFunction)
	plop.setActionType('updateGitHubActions', updateGitHubActions as PlopTypes.CustomActionFunction)
	plop.setActionType(
		'wranglerSecretPut',
		wranglerSecretPut as unknown as PlopTypes.CustomActionFunction
	)
	plop.setActionType(
		'writeWorkflowsApiTokens',
		writeWorkflowsApiTokens as PlopTypes.CustomActionFunction
	)

	plop.setHelper('slug', slugifyText)
	plop.setHelper('slug-s', slugifyTextSingular)
	plop.setHelper('slug-p', slugifyTextPlural)

	plop.setHelper('pascal', pascalText)
	plop.setHelper('pascal-s', pascalTextSingular)
	plop.setHelper('pascal-p', pascalTextPlural)

	// create a generator
	plop.setGenerator('new-worker', {
		description: 'Create a new Fetch Cloudflare Worker',
		// gather information from the user
		prompts: [
			{
				type: 'list',
				name: 'appsDir',
				message: 'Workspace location?',
				choices: ['apps', 'apps2'],
			},
			{
				type: 'input',
				name: 'name',
				message: 'name of worker',
				validate: (input: string) => {
					if (process.env.ALLOW_DUPES !== '1') {
						const workerName = slugifyText(input)
						console.log(
							`\n🌀 Ensuring worker "${workerName}" doesn't exist in your Cloudflare account...`
						)
						if (!isWorkerNameUnique(workerName)) {
							return 'Worker already exists in your account!'
						}
					}
					return true
				},
			},
			{
				type: 'list',
				name: 'uploadSecrets',
				message: 'Upload wrangler secrets?',
				choices: ['yes', 'no'],
			},
			{
				type: 'list',
				name: 'useAuth',
				message: 'Use bearer auth in Worker?',
				choices: ['yes', 'no'],
			},
		],
		// perform actions based on the prompts
		actions: (data: any) => {
			const answers = data as Answers
			process.chdir(answers.turbo.paths.root)

			let useAuthTypePartial = ''
			let useAuthMiddlewarePartial = ''
			let useAuthImportPartial = ''
			if (answers.useAuth === 'yes') {
				useAuthTypePartial = partials.useAuth.type
				useAuthMiddlewarePartial = partials.useAuth.middleware
				useAuthImportPartial = partials.useAuth.import
			}
			plop.setPartial('useAuthTypePartial', useAuthTypePartial)
			plop.setPartial('useAuthMiddlewarePartial', useAuthMiddlewarePartial)
			plop.setPartial('useAuthImportPartial', useAuthImportPartial)

			const actions: PlopTypes.Actions = [
				{
					type: 'addMany',
					base: 'templates/fetch-worker',
					destination: `${answers.appsDir}/{{ slug name }}`,
					templateFiles: [
						'templates/fetch-worker/**/**.hbs',
						'templates/fetch-worker/.eslintrc.cjs.hbs',
					],
				},
				{ type: 'pnpmInstall' },
				{ type: 'pnpmFix' },
				{ type: 'pnpmInstall' },
			]

			if (answers.uploadSecrets === 'yes') {
				actions.push(
					{
						type: 'wranglerSecretPut',
						data: { name: 'SENTRY_DSN' },
					},
					{
						type: 'wranglerSecretPut',
						data: { name: 'AXIOM_API_KEY' },
					}
				)

				if (answers.useAuth === 'yes') {
					actions.push({
						type: 'wranglerSecretPut',
						data: { name: 'API_TOKEN' },
					})
				}
			}

			actions.push({ type: 'updateGitHubActions' })
			return actions
		},
	})

	plop.setGenerator('workflows-worker', {
		description: 'Create a new Workflows Cloudflare Worker',
		// gather information from the user
		prompts: [
			{
				type: 'list',
				name: 'appsDir',
				message: 'Workspace location?',
				choices: ['apps', 'apps2'],
			},
			{
				type: 'input',
				name: 'name',
				message: 'name of worker',
				validate: (input: string) => {
					if (process.env.ALLOW_DUPES !== '1') {
						const workerName = slugifyText(input)
						console.log(
							`\n🌀 Ensuring worker "${workerName}" doesn't exist in your Cloudflare account...`
						)
						if (!isWorkerNameUnique(workerName)) {
							return 'Worker already exists in your account!'
						}
					}
					return true
				},
			},
			{
				type: 'input',
				name: 'workflowName',
				message: 'name of Workflow',
			},
			{
				type: 'list',
				name: 'uploadSecrets',
				message: 'Upload wrangler secrets?',
				choices: ['yes', 'no'],
			},
		],
		// perform actions based on the prompts
		actions: (data: any) => {
			const answers = data as WorkflowsAnswers
			process.chdir(answers.turbo.paths.root)

			const actions: PlopTypes.Actions = [
				{
					type: 'addMany',
					base: 'templates/workflows-worker',
					destination: `${answers.appsDir}/{{ slug name }}`,
					templateFiles: [
						'templates/workflows-worker/**/**.hbs',
						'templates/workflows-worker/.eslintrc.cjs.hbs',
					],
				},
				{ type: 'pnpmInstall' },
				{ type: 'pnpmFix' },
				{ type: 'pnpmInstall' },
			]

			if (answers.uploadSecrets === 'yes') {
				actions.push(
					{
						type: 'wranglerSecretPut',
						data: { name: 'SENTRY_DSN' },
					},
					{
						type: 'wranglerSecretPut',
						data: { name: 'AXIOM_API_KEY' },
					},
					{
						type: 'writeWorkflowsApiTokens',
					}
				)
			}

			actions.push({ type: 'updateGitHubActions' })
			return actions
		},
	})
}
