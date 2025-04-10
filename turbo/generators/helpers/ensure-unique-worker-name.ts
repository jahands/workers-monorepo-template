import { spawnSync } from 'child_process'

export function isWorkerNameUnique(name: string) {
	const proc = spawnSync('pnpm', ['exec', 'wrangler', 'deployments', 'list', '--name', name], {
		cwd: process.cwd(),
		env: {
			...process.env,
			CI: '1', // prevents wrangler from trying to login interactively
		},
		shell: true,
	})
	const stdout = proc.stdout.toString()
	if (proc.status === 0) {
		return false // It found the worker
	} else if (stdout.includes('[code: 10007]')) {
		return true // It didn't find the worker
	} else {
		// Probably need to login to wrangler
		throw new Error(`wrangler exited with status ${proc.status}. stdout: ${stdout}`)
	}
}
