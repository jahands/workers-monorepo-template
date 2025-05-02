import 'zx/globals'

import { program } from '@commander-js/extra-typings'
import { catchProcessError } from '@jahands/cli-tools'

import { buildCmd } from '../cmd/build'
import { checkCmd } from '../cmd/check'
import { checkWorkersTypesCmd } from '../cmd/check-workers-types'
import { fixCmd } from '../cmd/fix'

program
	.name('runx')
	.description('A CLI for scripts that automate this repo')

	// While `packages/tools/bin` scripts work well for simple tasks,
	// a typescript CLI is nicer for more complex things.

	.addCommand(checkWorkersTypesCmd)
	.addCommand(fixCmd)
	.addCommand(buildCmd)
	.addCommand(checkCmd)

	// Don't hang for unresolved promises
	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch(catchProcessError())
