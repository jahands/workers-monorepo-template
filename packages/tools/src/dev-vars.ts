import { chalk, echo, fs } from 'zx'

/**
 * Helper function to copy .dev.vars file for use in local development
 */
export async function ensureDevVarsExists(): Promise<void> {
	// Make sure .dev.vars exists
	const [devVarsExists, exampleDevVarsExists] = await Promise.all([
		fs.pathExists('.dev.vars'),
		fs.pathExists('.dev.vars.example'),
	])

	if (!devVarsExists && exampleDevVarsExists) {
		echo(chalk.grey('Copying .dev.vars.example to .dev.vars'))
		await fs.copy('.dev.vars.example', '.dev.vars')
	}
}
