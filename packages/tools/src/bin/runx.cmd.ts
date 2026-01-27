import 'zx/globals'

import { program } from '@commander-js/extra-typings'
import { catchProcessError } from '@jahands/cli-tools/proc'

import { buildCmd } from '../cmd/build.cmd'
import { checkCmd } from '../cmd/check.cmd'
import { ciCmd } from '../cmd/ci.cmd'
import { devCmd } from '../cmd/dev.cmd'
import { fixCmd } from '../cmd/fix.cmd'
import { shfmtCmd } from '../cmd/shfmt.cmd'
import { updateCmd } from '../cmd/update.cmd'

program
	.name('runx')
	.description('A CLI for scripts that automate this repo')

	// While `packages/tools/bin` scripts work well for simple tasks,
	// a typescript CLI is nicer for more complex things.

	.addCommand(fixCmd)
	.addCommand(buildCmd)
	.addCommand(checkCmd)
	.addCommand(devCmd)
	.addCommand(ciCmd)
	.addCommand(updateCmd)
	.addCommand(shfmtCmd)

	// Don't hang for unresolved promises
	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch(catchProcessError())
