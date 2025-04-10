export function onProcSuccess(
	name: string,
	resolve: (value: unknown) => void,
	reject: (reason?: any) => void
) {
	return (proc: ProcessOutput) => {
		if (proc.exitCode === 0) {
			resolve(`${name} ran correctly`)
		} else {
			reject(`${name} exited with ${proc.exitCode}`)
		}
	}
}

export function catchError(reject: (reason?: any) => void) {
	return () => reject('unknown error')
}
