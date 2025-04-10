// inlined from @repo/dayjs to prevent cyclic dependency
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export { dayjs }

export type TZ = (typeof TZ)[keyof typeof TZ]
export const TZ = {
	CST: 'America/Chicago',
	UTC: 'UTC',
} as const satisfies Record<string, string>

export const cst = 'America/Chicago' satisfies TZ
