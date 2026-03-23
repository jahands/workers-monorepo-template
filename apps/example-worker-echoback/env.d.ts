// oxlint-disable @typescript-eslint/consistent-type-imports
type LocalEnv = import('./src/context').Env
type MainModule = typeof import('./src/example-worker-echoback.app')

// Add Env to Cloudflare namespace so that we can access it via
// import { env } from 'cloudflare:workers'
declare namespace Cloudflare {
	interface Env extends LocalEnv {}
	interface GlobalProps {
		mainModule: MainModule
	}
}
