import 'zx/globals'

import { program } from '@commander-js/extra-typings'
import { catchProcessError } from '@jahands/cli-tools'
import ts from 'typescript'

import { z } from '@repo/zod'

import { getTSConfig } from '../lib/tsconfig'
import { timeFn } from '../time'

program
	.name('runx-bundle-lib-build-types')
	.description('Separate CLI to build types (because importing typescript as a lib is slow)')
	.argument('<entrypoints...>', 'Entrypoint(s) of the app. e.g. src/index.ts')
	.action(async (entryPoints) => {
		z.string().array().min(1).parse(entryPoints)

		const tsconfig = ts.readConfigFile('./tsconfig.json', ts.sys.readFile)
		if (tsconfig.error) {
			throw new Error(`failed to read tsconfig: ${Bun.inspect(tsconfig)}`)
		}

		const tsCompOpts = {
			...getTSConfig(),
			declaration: true,
			declarationMap: true,
			emitDeclarationOnly: true,
			noEmit: false,
			outDir: './dist/',
		} satisfies ts.CompilerOptions

		await timeFn('tsc', async () => {
			const program = ts.createProgram(entryPoints, tsCompOpts)
			program.emit()
		})()
	})

	.hook('postAction', () => process.exit(0))
	.parseAsync()
	.catch(catchProcessError())
