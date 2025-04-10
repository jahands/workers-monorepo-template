import 'zx/globals'

import { program } from '@commander-js/extra-typings'
import { catchProcessError } from '@jahands/cli-tools'

import { astroCmd } from '../cmd/astro'
import { buildCmd } from '../cmd/build'
import { checkCmd } from '../cmd/check'
import { ciCmd } from '../cmd/ci'
import { deployCmd } from '../cmd/deploy'
import { devCmd } from '../cmd/dev'
import { fixCmd } from '../cmd/fix'
import { migrateCmd } from '../cmd/migrate'
import { mscCmd } from '../cmd/msc'
import { parseChangesetCmd } from '../cmd/parse-changeset'
import { prettierCmd } from '../cmd/prettier/prettier'
import { runCmd } from '../cmd/run'
import { sentryCmd } from '../cmd/sentry'
import { settingsCmd } from '../cmd/settings'
import { testCmd } from '../cmd/test'
import { updateCmd } from '../cmd/update'
import { updateWranglerTomlsCmd } from '../cmd/update-wrangler-tomls'
import { workflowsCmd } from '../cmd/workflows'

program
	.name('runx')
	.description('A CLI for scripts that automate this repo')

	.addCommand(testCmd)
	.addCommand(checkCmd)
	.addCommand(fixCmd)
	.addCommand(updateCmd)

	.addCommand(devCmd)
	.addCommand(buildCmd)
	.addCommand(deployCmd)
	.addCommand(sentryCmd)

	.addCommand(prettierCmd)
	.addCommand(astroCmd)

	.addCommand(workflowsCmd)

	.addCommand(runCmd)
	.addCommand(updateWranglerTomlsCmd)
	.addCommand(parseChangesetCmd)
	.addCommand(mscCmd)
	.addCommand(settingsCmd)
	.addCommand(migrateCmd)
	.addCommand(ciCmd)

	// Don't hang for unresolved promises
	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch(catchProcessError())
