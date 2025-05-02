import { inspect } from 'node:util'
import ts from 'typescript'

export function getTSConfig(configPath = 'tsconfig.json'): ts.CompilerOptions {
	const jsonCompopts = getCompilerOptionsJSONFollowExtends(configPath)
	const tmp = ts.convertCompilerOptionsFromJson(jsonCompopts, '')
	if (tmp.errors.length > 0) {
		throw new Error(`failed parse config: ${inspect(tmp)}`)
	}
	const tsCompopts: ts.CompilerOptions = tmp.options
	return tsCompopts
}

export function getCompilerOptionsJSONFollowExtends(configPath: string): {
	[key: string]: unknown
} {
	let compopts = {}
	const config = ts.readConfigFile(configPath, ts.sys.readFile).config
	if (config.extends !== undefined) {
		const rqrpath = require.resolve(config.extends)
		compopts = getCompilerOptionsJSONFollowExtends(rqrpath)
	}
	return {
		...compopts,
		...config.compilerOptions,
	}
}
