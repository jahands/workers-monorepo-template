import fs from 'node:fs'

import { YAML } from '@repo/workspace-dependencies/yaml'
import { z } from '@repo/workspace-dependencies/zod'

import { slugifyText } from '../helpers/slugify'

import type { PlopTypes } from '@turbo/gen'
import type { Answers } from '../types'

export function updateGitHubActions(answers: Answers, _config: any, _plop: PlopTypes.NodePlopAPI) {
	return new Promise((resolve, _reject) => {
		const workflow = '.github/workflows/deploy-single-worker.yml'
		const path = `${answers.turbo.paths.root}/${workflow}`
		console.log(`🌀 Adding worker to ${workflow}`)

		const data = fs.readFileSync(path).toString()
		const doc = YAML.parseDocument(data)
		const name = `${answers.appsDir}/${slugifyText(answers.name)}`
		const optionsPath = ['on', 'workflow_dispatch', 'inputs', 'worker', 'options']
		const seq = doc.getIn(optionsPath) as any
		const seqJS = z.array(z.string()).parse(seq.toJS(doc))
		if (!seqJS.includes(name)) {
			seq.add(name)
		}
		const sorted = seq.toJS(doc).sort()
		doc.setIn(optionsPath, sorted)
		fs.writeFileSync(path, doc.toString())
		resolve(0)
	})
}
