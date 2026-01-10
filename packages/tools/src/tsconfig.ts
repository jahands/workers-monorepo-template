import path from 'node:path'
import { inspect } from 'node:util'

import type {
	createProgram,
	parseJsonConfigFileContent,
	readConfigFile,
	sys,
	CompilerOptions as TSCompilerOptions,
} from 'typescript'

export type { TSCompilerOptions }

interface TSModule {
	readConfigFile: typeof readConfigFile
	parseJsonConfigFileContent: typeof parseJsonConfigFileContent
	sys: typeof sys
	createProgram: typeof createProgram
}

/**
 * TypeScript helpers. This is a class so that we can dynamically import the TypeScript module
 * to reduce runx start time for commands that don't use the typescript package.
 *
 * @example
 *
 * ```ts
 * const tsHelpers = await new TSHelpers().init()
 * const { ts } = tsHelpers
 * const tsConfig = tsHelpers.getTSConfig()
 * ts.createProgram(entryPoints, tsConfig).emit()
 * ```
 */
export class TSHelpers {
	#ts: TSModule | undefined
	public get ts(): TSModule {
		if (!this.#ts) {
			throw new Error('TSHelpers not initialized. Call init() first.')
		}
		return this.#ts
	}

	async init(): Promise<TSHelpers> {
		this.#ts = (await import('typescript')) as TSModule
		return this
	}

	getTSConfig(configPath = 'tsconfig.json'): TSCompilerOptions {
		const absolutePath = path.resolve(configPath)
		const configFile = this.ts.readConfigFile(absolutePath, this.ts.sys.readFile)
		if (configFile.error) {
			throw new Error(`Failed to read tsconfig: ${inspect(configFile.error)}`)
		}

		const parsed = this.ts.parseJsonConfigFileContent(
			configFile.config,
			this.ts.sys,
			path.dirname(absolutePath)
		)
		if (parsed.errors.length > 0) {
			throw new Error(`Failed to parse tsconfig: ${inspect(parsed.errors)}`)
		}

		return parsed.options
	}
}
