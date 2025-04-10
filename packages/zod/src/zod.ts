// Re-exported with additional functionality based on:
// https://x.com/colinhacks/status/1852428728103776631

export * from 'zod'

export { deepPassthrough, deepStrip, deepStrict } from './lib/deep'
export type { DeepPassthrough, DeepStrip, DeepStrict } from './lib/deep'

export { numberMin0 } from './lib/number'
export { parse, safeParse, safeParseAsync } from './lib/parse'
