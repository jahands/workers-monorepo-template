import type { ProcessOutput } from 'zx'

export function onProcSuccess(
	name: string,
	resolve: (value: unknown) => void,
	reject: (reason?: unknown) => void
) {
	return (proc: ProcessOutput) => {
		if (proc.exitCode === 0) {
			resolve(`${name} ran correctly`)
		} else {
			reject(`${name} exited with ${proc.exitCode}`)
		}
	}
}

export function catchError(reject: (reason?: unknown) => void) {
	return () => reject('unknown error')
}
