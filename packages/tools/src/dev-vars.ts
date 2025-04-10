/**
 * Helper function to copy .dev.vars file for use in local development
 */
export async function ensureDevVarsExists(): Promise<void> {
	// Make sure .dev.vars exists
	const exampleDevVars = Bun.file('.dev.vars.example')
	const devVars = Bun.file('.dev.vars')

	if (!(await devVars.exists()) && (await exampleDevVars.exists())) {
		echo(chalk.grey('Copying .dev.vars.example to .dev.vars'))
		await devVars.write(await exampleDevVars.text())
	}
}
