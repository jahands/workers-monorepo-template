/**
 * Wraps the given function and prints how long it took
 *
 * @description Description of what's running, e.g. 'wrangler deploy'
 */
export function timeFn<T>(description: string, fn: () => PromiseLike<T>): () => PromiseLike<T> {
	return async () => {
		const label = chalk.blue(`${description} complete`)
		try {
			console.time(label)
			const res = await fn()
			return res
		} finally {
			console.timeEnd(label)
		}
	}
}
