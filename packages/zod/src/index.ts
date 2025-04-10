// Re-exported with additional functionality based on:
// https://x.com/colinhacks/status/1852428728103776631
// This extra layer of indirection is needed so that we
// get auto-complete for `import { z } from '@repo/zod'`
// when typing "z."
export * as z from './zod'
export * from 'zod'
