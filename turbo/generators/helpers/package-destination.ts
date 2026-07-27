import path from 'node:path'

import type { Paths } from '../answers'

export function packageDestination(
	paths: Paths,
	packageName: string,
	fallbackDirectory = 'packages'
) {
	const baseDirectory = path.relative(paths.root, paths.cwd) || fallbackDirectory
	return path.join(baseDirectory, packageName)
}
