// Generic type for asserting only the keys of a type
export type KeysOf<T> = Record<keyof T, unknown>

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyStr<T extends string> = T | (string & {})
