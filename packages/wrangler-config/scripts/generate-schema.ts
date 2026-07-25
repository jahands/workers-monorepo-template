// code-quality: vibe-coded
import 'zx/globals'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

type JsonSchema = Record<string, unknown>

const configJson = await fs.readFile(
	path.join(__dirname, '..', 'node_modules', 'wrangler', 'config-schema.json'),
	'utf8'
)

const rootSchema = JSON.parse(configJson) as JsonSchema
const rootRef = typeof rootSchema.$ref === 'string' ? rootSchema.$ref : '#'

const schemaByRef = new Map<string, JsonSchema>()
const nameByRef = new Map<string, string>()
const usedNames = new Set<string>()

type WarningEntry = {
	code: string
	pointer: string
	message: string
	count: number
}

const warnings = new Map<string, WarningEntry>()
let needsDeepEqual = false
let needsUnique = false
let needsOneOf = false

const outputPath = path.join(__dirname, '..', 'src', 'schema.ts')

const decodePointer = (segment: string) => segment.replace(/~1/g, '/').replace(/~0/g, '~')
const encodePointer = (segment: string) => segment.replace(/~/g, '~0').replace(/\//g, '~1')

const joinPointer = (base: string, segment: string | number) =>
	`${base}/${encodePointer(String(segment))}`

const normalizeRef = (ref: string) => {
	if (ref.startsWith('#')) {
		return ref
	}
	throw new Error(`Unsupported $ref: ${ref}`)
}

const isObject = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value)

const refToName = (ref: string) => {
	if (ref === '#') {
		return 'WranglerConfig'
	}
	const parts = ref.split('/')
	const last = decodePointer(parts[parts.length - 1] ?? 'Schema')
	return toPascalCase(last)
}

const toPascalCase = (value: string) => {
	const cleaned = value
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim()
		.split(' ')
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() + part.slice(1))
		.join('')

	if (!cleaned) {
		return 'Schema'
	}
	if (/^[0-9]/.test(cleaned)) {
		return `Schema${cleaned}`
	}
	return cleaned
}

const warn = (code: string, pointer: string, message: string) => {
	const key = `${code}|${pointer}|${message}`
	const existing = warnings.get(key)
	if (existing) {
		existing.count += 1
		return
	}
	warnings.set(key, { code, pointer, message, count: 1 })
}

const ensureUniqueName = (base: string) => {
	let name = base
	let counter = 2
	while (usedNames.has(name)) {
		name = `${base}${counter}`
		counter += 1
	}
	usedNames.add(name)
	return name
}

const getByPointer = (schema: JsonSchema, ref: string): JsonSchema => {
	const pointer = normalizeRef(ref)
	if (pointer === '#') {
		return schema
	}
	const segments = pointer.replace(/^#\//, '').split('/').map(decodePointer)
	let current: unknown = schema
	for (const segment of segments) {
		if (!isObject(current) || !(segment in current)) {
			throw new Error(`Unable to resolve ref ${ref}`)
		}
		current = current[segment]
	}
	if (!isObject(current)) {
		return current as JsonSchema
	}
	return current
}

const registerRef = (ref: string, forcedName?: string) => {
	const normalized = normalizeRef(ref)
	if (nameByRef.has(normalized)) {
		return nameByRef.get(normalized) as string
	}
	const schema = getByPointer(rootSchema, normalized)
	const baseName = forcedName ?? refToName(normalized)
	const name = ensureUniqueName(baseName)
	nameByRef.set(normalized, name)
	schemaByRef.set(normalized, schema)
	return name
}

const collectRefsFromSchema = (
	schema: JsonSchema,
	pointer = '#',
	refs = new Set<string>(),
	seen = new Set<JsonSchema>()
) => {
	if (seen.has(schema)) return refs
	seen.add(schema)

	if (typeof schema.$ref === 'string') {
		refs.add(normalizeRef(schema.$ref))
	}

	const defs = (schema.definitions ?? schema.$defs) as Record<string, JsonSchema> | undefined
	if (defs) {
		const prefix = schema.definitions ? 'definitions' : '$defs'
		for (const key of Object.keys(defs).sort()) {
			const defPointer = `${pointer}/${prefix}/${encodePointer(key)}`
			refs.add(defPointer)
			const defSchema = defs[key]
			if (isObject(defSchema)) {
				collectRefsFromSchema(defSchema as JsonSchema, defPointer, refs, seen)
			}
		}
	}

	for (const key of Object.keys(schema).sort()) {
		const value = schema[key]
		if (isObject(value)) {
			collectRefsFromSchema(value as JsonSchema, joinPointer(pointer, key), refs, seen)
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (isObject(item)) {
					collectRefsFromSchema(
						item as JsonSchema,
						joinPointer(joinPointer(pointer, key), index),
						refs,
						seen
					)
				}
			})
		}
	}

	return refs
}

registerRef(rootRef, 'WranglerConfig')
const discoveredRefs = Array.from(collectRefsFromSchema(rootSchema)).sort()
for (const ref of discoveredRefs) {
	if (!nameByRef.has(ref)) {
		registerRef(ref)
	}
}

const refDependencies = new Map<string, Set<string>>()

const collectRefTargets = (
	schema: JsonSchema,
	targets = new Set<string>(),
	seen = new Set<JsonSchema>()
) => {
	if (seen.has(schema)) return targets
	seen.add(schema)
	if (typeof schema.$ref === 'string') {
		targets.add(normalizeRef(schema.$ref))
	}
	for (const value of Object.values(schema)) {
		if (isObject(value)) {
			collectRefTargets(value as JsonSchema, targets, seen)
		} else if (Array.isArray(value)) {
			for (const item of value) {
				if (isObject(item)) {
					collectRefTargets(item as JsonSchema, targets, seen)
				}
			}
		}
	}
	return targets
}

for (const [ref, schema] of Array.from(schemaByRef.entries()).sort(([a], [b]) =>
	a.localeCompare(b)
)) {
	const targets = collectRefTargets(schema)
	refDependencies.set(ref, new Set(Array.from(targets).filter((target) => schemaByRef.has(target))))
}

const cycleComponentByRef = new Map<string, number>()

const buildCycleComponents = () => {
	const refs = Array.from(refDependencies.keys()).sort()
	const indexByRef = new Map<string, number>()
	const lowLinkByRef = new Map<string, number>()
	const stack: string[] = []
	const onStack = new Set<string>()
	let index = 0
	let componentId = 0

	const visit = (ref: string) => {
		indexByRef.set(ref, index)
		lowLinkByRef.set(ref, index)
		index += 1
		stack.push(ref)
		onStack.add(ref)

		for (const target of Array.from(refDependencies.get(ref) ?? []).sort()) {
			if (!indexByRef.has(target)) {
				visit(target)
				lowLinkByRef.set(
					ref,
					Math.min(lowLinkByRef.get(ref) as number, lowLinkByRef.get(target) as number)
				)
			} else if (onStack.has(target)) {
				lowLinkByRef.set(
					ref,
					Math.min(lowLinkByRef.get(ref) as number, indexByRef.get(target) as number)
				)
			}
		}

		if (lowLinkByRef.get(ref) === indexByRef.get(ref)) {
			const component: string[] = []
			while (stack.length > 0) {
				const current = stack.pop() as string
				onStack.delete(current)
				component.push(current)
				if (current === ref) break
			}

			const hasSelfLoop =
				component.length === 1 && (refDependencies.get(component[0])?.has(component[0]) ?? false)
			if (component.length > 1 || hasSelfLoop) {
				for (const member of component) {
					cycleComponentByRef.set(member, componentId)
				}
				componentId += 1
			}
		}
	}

	for (const ref of refs) {
		if (!indexByRef.has(ref)) {
			visit(ref)
		}
	}
}

buildCycleComponents()

const refsInSchemaCache = new WeakMap<JsonSchema, Set<string>>()

const getRefsInSchema = (schema: JsonSchema): Set<string> => {
	const cached = refsInSchemaCache.get(schema)
	if (cached) return cached
	const refs = collectRefTargets(schema)
	refsInSchemaCache.set(schema, refs)
	return refs
}

const shouldUseGetterForSchema = (currentRef: string | undefined, schema: JsonSchema) => {
	if (!currentRef) return false
	const currentComponent = cycleComponentByRef.get(currentRef)
	if (currentComponent === undefined) return false
	for (const target of getRefsInSchema(schema)) {
		if (cycleComponentByRef.get(target) === currentComponent) {
			return true
		}
	}
	return false
}

const indent = (value: string, level = 1) => {
	const prefix = '\t'.repeat(level)
	return value
		.split('\n')
		.map((line) => (line ? `${prefix}${line}` : line))
		.join('\n')
}

const stringify = (value: JsonValue) => JSON.stringify(value, null, '\t')

const deepEqualValue = (a: JsonValue, b: JsonValue): boolean => {
	if (a === b) return true
	if (typeof a !== typeof b) return false
	if (a === null || b === null) return false
	if (Array.isArray(a) !== Array.isArray(b)) return false
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		for (let i = 0; i < a.length; i += 1) {
			if (!deepEqualValue(a[i] as JsonValue, b[i] as JsonValue)) return false
		}
		return true
	}
	if (isObject(a) && isObject(b)) {
		const aKeys = Object.keys(a).sort()
		const bKeys = Object.keys(b).sort()
		if (aKeys.length !== bKeys.length) return false
		for (let i = 0; i < aKeys.length; i += 1) {
			const key = aKeys[i]
			if (key !== bKeys[i]) return false
			if (!deepEqualValue(a[key] as JsonValue, b[key] as JsonValue)) return false
		}
		return true
	}
	return false
}

const getSchemaTypes = (schema: JsonSchema) => {
	const types = Array.isArray(schema.type)
		? (schema.type as string[])
		: schema.type
			? [schema.type as string]
			: []
	if (types.length > 0) return types
	if (schema.properties || schema.additionalProperties || Array.isArray(schema.required))
		return ['object']
	if (schema.items) return ['array']
	return []
}

const getSyntheticSummary = (schema: JsonSchema) => {
	if (schema.const !== undefined) {
		return `Allowed value: ${JSON.stringify(schema.const as JsonValue)}`
	}
	if (Array.isArray(schema.enum) && schema.enum.length > 0) {
		const rendered = (schema.enum as JsonValue[]).map((value) => JSON.stringify(value)).join(', ')
		return `Allowed values: ${rendered}`
	}
	const types = getSchemaTypes(schema)
	if (types.length === 1) {
		return `Type: ${types[0]}`
	}
	if (types.length > 1) {
		return `Type: ${types.join(' | ')}`
	}
	return ''
}

const matchesType = (value: JsonValue, type: string) => {
	switch (type) {
		case 'string':
			return typeof value === 'string'
		case 'number':
			return typeof value === 'number'
		case 'integer':
			return typeof value === 'number' && Number.isInteger(value)
		case 'boolean':
			return typeof value === 'boolean'
		case 'null':
			return value === null
		case 'array':
			return Array.isArray(value)
		case 'object':
			return isObject(value)
		default:
			return true
	}
}

const matchesSchemaDefault = (schema: JsonSchema, value: JsonValue) => {
	if (schema.const !== undefined) {
		return deepEqualValue(value, schema.const as JsonValue)
	}
	if (Array.isArray(schema.enum)) {
		return (schema.enum as JsonValue[]).some((item) => deepEqualValue(item, value))
	}
	const types = getSchemaTypes(schema)
	if (types.length > 0 && !types.some((type) => matchesType(value, type))) {
		return false
	}
	const expectsObject = types.length === 0 || types.includes('object')
	if (expectsObject && (schema.properties || schema.additionalProperties || schema.required)) {
		if (!isObject(value)) return false
		if (Array.isArray(schema.required)) {
			for (const key of schema.required) {
				if (!(key in value)) return false
			}
		}
	}
	const expectsArray = types.length === 0 || types.includes('array')
	if (expectsArray && schema.items) {
		if (!Array.isArray(value)) return false
	}
	return true
}

const metaKeys = new Set([
	'$id',
	'$schema',
	'$comment',
	'title',
	'description',
	'markdownDescription',
	'examples',
	'deprecated',
	'readOnly',
	'writeOnly',
])

const hasMeaningfulKeywords = (schema: JsonSchema) =>
	Object.keys(schema).some((key) => !metaKeys.has(key) && key !== 'default' && key !== 'nullable')

const escapeDoc = (value: string) => value.replace(/\*\//g, '* /')

const getRenderedDefault = (schema: JsonSchema) => {
	if (!('default' in schema)) return ''
	const defaultValue = schema.default as JsonValue
	if (defaultValue === undefined) return ''
	if (!matchesSchemaDefault(schema, defaultValue)) return ''
	return JSON.stringify(defaultValue) ?? ''
}

const buildDoc = (schema: JsonSchema) => {
	const title = typeof schema.title === 'string' ? schema.title.trim() : ''
	const description = typeof schema.description === 'string' ? schema.description.trim() : ''
	const lines: string[] = []

	if (title) {
		lines.push(escapeDoc(title))
	}
	if (description && description !== title) {
		if (lines.length) lines.push('')
		lines.push(...escapeDoc(description).split('\n'))
	}
	if (!description && !title) {
		const syntheticSummary = getSyntheticSummary(schema)
		if (syntheticSummary) {
			if (lines.length) lines.push('')
			lines.push(escapeDoc(syntheticSummary))
		}
	}
	if (schema.deprecated === true) {
		lines.push('')
		lines.push('@deprecated')
	}
	const renderedDefault = getRenderedDefault(schema)
	if (renderedDefault) {
		lines.push('')
		lines.push(`@default ${renderedDefault}`)
	}
	if (Array.isArray(schema.examples)) {
		const examples = (schema.examples as JsonValue[]).slice(0, 3)
		for (const example of examples) {
			const rendered = JSON.stringify(example)
			if (!rendered) continue
			lines.push('')
			lines.push(`@example ${rendered}`)
		}
	}

	if (!lines.length) return ''
	return `/**\n${lines.map((line) => ` * ${line}`.trimEnd()).join('\n')}\n */`
}

const getDescribe = (schema: JsonSchema) => {
	const description = typeof schema.description === 'string' ? schema.description.trim() : ''
	const title = typeof schema.title === 'string' ? schema.title.trim() : ''
	let text = description || title || getSyntheticSummary(schema)
	if (!text && schema.deprecated === true) {
		text = 'Deprecated.'
	}
	if (text && schema.deprecated === true && !/deprecated/i.test(text)) {
		text = `${text} (deprecated)`
	}
	const renderedDefault = getRenderedDefault(schema)
	if (renderedDefault) {
		const defaultText = `Default: ${renderedDefault}`
		text = text ? `${text}\n\n${defaultText}` : defaultText
	}
	return text
}

const emitPrimitiveLiteral = (value: JsonValue) => {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return `z.literal(${JSON.stringify(value)})`
	}
	needsDeepEqual = true
	return `z.any().refine((val) => deepEqual(val, ${stringify(value)}), { error: 'Expected const value' })`
}

const withDefault = (
	schemaText: string,
	schema: JsonSchema,
	options: { allowPrefault: boolean; pointer: string }
) => {
	if (!('default' in schema)) return schemaText
	const defaultValue = schema.default as JsonValue
	if (defaultValue === undefined) return schemaText
	if (!options.allowPrefault) {
		return schemaText
	}
	if (!matchesSchemaDefault(schema, defaultValue)) {
		warn(
			'invalid-default',
			options.pointer,
			'Skipped default because it does not satisfy schema constraints.'
		)
		return schemaText
	}
	return `${schemaText}.prefault(${stringify(defaultValue)})`
}

const mergeConstraints = (schemaText: string, schema: JsonSchema) => {
	let next = schemaText
	if (typeof schema.minLength === 'number') {
		next = `${next}.min(${schema.minLength})`
	}
	if (typeof schema.maxLength === 'number') {
		next = `${next}.max(${schema.maxLength})`
	}
	if (typeof schema.pattern === 'string') {
		const pattern = schema.pattern as string
		next = `${next}.regex(new RegExp(${JSON.stringify(pattern)}))`
	}
	if (typeof schema.minimum === 'number') {
		next = `${next}.min(${schema.minimum})`
	}
	if (typeof schema.maximum === 'number') {
		next = `${next}.max(${schema.maximum})`
	}
	if (typeof schema.exclusiveMinimum === 'number') {
		next = `${next}.min(${schema.exclusiveMinimum}, { inclusive: false })`
	}
	if (typeof schema.exclusiveMaximum === 'number') {
		next = `${next}.max(${schema.exclusiveMaximum}, { inclusive: false })`
	}
	if (typeof schema.multipleOf === 'number') {
		const multiple = schema.multipleOf as number
		next = `${next}.refine((value) => Number.isFinite(value) && Math.abs(value / ${multiple} - Math.round(value / ${multiple})) < 1e-9, { error: 'Expected multipleOf ${multiple}' })`
	}
	return next
}

const emitString = (schema: JsonSchema) => {
	const format = typeof schema.format === 'string' ? schema.format : undefined
	let base = 'z.string()'
	if (format) {
		const normalized = format.toLowerCase()
		switch (normalized) {
			case 'email':
				base = 'z.email()'
				break
			case 'uri':
				base = 'z.string()'
				break
			case 'url':
				base = 'z.url()'
				break
			case 'uuid':
				base = 'z.uuid()'
				break
			case 'ip':
				base = 'z.ip()'
				break
			case 'date-time':
				base = 'z.iso.datetime()'
				break
			case 'date':
				base = 'z.iso.date()'
				break
			default:
				base = 'z.string()'
		}
	}
	return mergeConstraints(base, schema)
}

const emitArray = (schema: JsonSchema, ctx: EmitContext) => {
	const items = schema.items
	let base = ''
	if (Array.isArray(items)) {
		const tupleItems = items.map((item, index) =>
			emitSchema(item as JsonSchema, {
				...ctx,
				pointer: joinPointer(joinPointer(ctx.pointer, 'items'), index),
				allowPrefault: false,
			})
		)
		base = `z.tuple([${tupleItems.join(', ')}])`
		const additionalItems = schema.additionalItems
		if (additionalItems && additionalItems !== true) {
			base = `${base}.rest(${emitSchema(additionalItems as JsonSchema, {
				...ctx,
				pointer: joinPointer(ctx.pointer, 'additionalItems'),
				allowPrefault: false,
			})})`
		}
	} else if (items && isObject(items)) {
		base = `z.array(${emitSchema(items as JsonSchema, {
			...ctx,
			pointer: joinPointer(ctx.pointer, 'items'),
			allowPrefault: false,
		})})`
	} else {
		base = 'z.array(z.any())'
	}

	if (typeof schema.minItems === 'number') {
		base = `${base}.min(${schema.minItems})`
	}
	if (typeof schema.maxItems === 'number') {
		base = `${base}.max(${schema.maxItems})`
	}
	if (schema.uniqueItems === true) {
		needsUnique = true
		needsDeepEqual = true
		base = `${base}.refine((values) => isUnique(values), { error: 'Expected unique items' })`
	}
	return base
}

const emitEnum = (schema: JsonSchema) => {
	const values = schema.enum as JsonValue[]
	const allStrings = values.every((value) => typeof value === 'string')
	if (allStrings) {
		return `z.enum([${values.map((value) => JSON.stringify(value)).join(', ')}])`
	}
	return `z.union([${values.map((value) => emitPrimitiveLiteral(value)).join(', ')}])`
}

type EmitContext = {
	stack: Set<JsonSchema>
	pointer: string
	allowPrefault: boolean
	currentRef?: string
	directRef?: boolean
}

const wranglerTopLevelPropertyOrder = [
	'$schema',
	'name',
	'account_id',
	'main',
	'compatibility_date',
	'compatibility_flags',
	'workers_dev',
	'preview_urls',
	'logpush',
	'routes',
	'route',
	'assets',
	'observability',
	'placement',
	'secrets_store_secrets',
	'tail_consumers',
	'vars',
	'kv_namespaces',
	'analytics_engine_datasets',
	'r2_buckets',
	'triggers',
	'limits',
	'containers',
	'images',
	'worker_loaders',
	'services',
	'hyperdrive',
	'ratelimits',
	'd1_databases',
	'ai',
	'rules',
	'durable_objects',
	'pipelines',
	'queues',
	'workflows',
	'migrations',
	'vpc_services',
	'version_metadata',
]

const wranglerTopLevelPropertyIndex = new Map(
	wranglerTopLevelPropertyOrder.map((key, index) => [key, index] as const)
)

const queueConsumerPropertyOrder = [
	'queue',
	'max_batch_size',
	'max_batch_timeout',
	'max_concurrency',
	'max_retries',
]

const queueConsumerPropertyIndex = new Map(
	queueConsumerPropertyOrder.map((key, index) => [key, index] as const)
)

const isQueueConsumerItemsPointer = (pointer: string) =>
	pointer.includes('/queues/') && pointer.includes('/consumers/') && pointer.endsWith('/items')

const orderObjectKeys = (keys: string[], pointer: string) => {
	if (isQueueConsumerItemsPointer(pointer)) {
		return keys.sort((a, b) => {
			const aIndex = queueConsumerPropertyIndex.get(a)
			const bIndex = queueConsumerPropertyIndex.get(b)
			if (aIndex !== undefined && bIndex !== undefined) {
				return aIndex - bIndex
			}
			if (aIndex !== undefined) {
				return -1
			}
			if (bIndex !== undefined) {
				return 1
			}
			return a.localeCompare(b)
		})
	}

	if (pointer !== '#/definitions/RawConfig') {
		return keys.sort()
	}

	return keys.sort((a, b) => {
		const aIndex = wranglerTopLevelPropertyIndex.get(a)
		const bIndex = wranglerTopLevelPropertyIndex.get(b)
		if (aIndex !== undefined && bIndex !== undefined) {
			return aIndex - bIndex
		}
		if (aIndex !== undefined) {
			return -1
		}
		if (bIndex !== undefined) {
			return 1
		}
		return a.localeCompare(b)
	})
}

const isNullableSchema = (schema: JsonSchema) => {
	const types = Array.isArray(schema.type)
		? (schema.type as string[])
		: schema.type
			? [schema.type as string]
			: []
	const hasNull = types.includes('null') || schema.nullable === true
	if (!hasNull) return false
	if (types.length === 1 && types[0] === 'null') return false
	return true
}

const emitSchemaCore = (schema: JsonSchema, ctx: EmitContext): string => {
	if (typeof schema.$ref === 'string') {
		const refName = registerRef(schema.$ref)
		const refExpr = ctx.directRef ? refName : `z.lazy(() => ${refName})`
		const { $ref: _ref, ...rest } = schema as Record<string, unknown>
		const siblingSchema = rest as JsonSchema
		if (hasMeaningfulKeywords(siblingSchema)) {
			const siblingExpr = emitSchemaCore(siblingSchema, ctx)
			return `z.intersection(${refExpr}, ${siblingExpr})`
		}
		return refExpr
	}

	if (Array.isArray(schema.allOf)) {
		const parts = schema.allOf.map((item, index) =>
			emitSchema(item as JsonSchema, {
				...ctx,
				pointer: joinPointer(joinPointer(ctx.pointer, 'allOf'), index),
				allowPrefault: false,
			})
		)
		if (parts.length === 1) {
			return parts[0]
		}
		if (parts.length > 1) {
			return parts.reduce((acc, part) => `z.intersection(${acc}, ${part})`)
		}
	}

	if (Array.isArray(schema.anyOf)) {
		const parts = schema.anyOf.map((item, index) =>
			emitSchema(item as JsonSchema, {
				...ctx,
				pointer: joinPointer(joinPointer(ctx.pointer, 'anyOf'), index),
				allowPrefault: false,
			})
		)
		return `z.union([${parts.join(', ')}])`
	}

	if (Array.isArray(schema.oneOf)) {
		needsOneOf = true
		const parts = schema.oneOf.map((item, index) =>
			emitSchema(item as JsonSchema, {
				...ctx,
				pointer: joinPointer(joinPointer(ctx.pointer, 'oneOf'), index),
				allowPrefault: false,
			})
		)
		return `oneOf([${parts.join(', ')}])`
	}

	if (schema.not) {
		warn('unsupported-not', ctx.pointer, 'Encountered `not`; emitted z.any().')
		return 'z.any()'
	}

	if (schema.if || schema.then || schema.else) {
		warn('unsupported-conditional', ctx.pointer, 'Encountered if/then/else; emitted z.any().')
		return 'z.any()'
	}

	if (schema.const !== undefined) {
		return emitPrimitiveLiteral(schema.const as JsonValue)
	}

	if (Array.isArray(schema.enum)) {
		return emitEnum(schema)
	}

	const types = getSchemaTypes(schema)
	const nonNullTypes = types.filter((type) => type !== 'null')

	if (types.length > 0 && nonNullTypes.length === 0) {
		return 'z.null()'
	}

	let base = ''
	if (nonNullTypes.length === 1) {
		switch (nonNullTypes[0]) {
			case 'string':
				base = emitString(schema)
				break
			case 'number':
				base = mergeConstraints('z.number()', schema)
				break
			case 'integer':
				base = mergeConstraints('z.int()', schema)
				break
			case 'boolean':
				base = 'z.boolean()'
				break
			case 'object': {
				const properties = isObject(schema.properties)
					? (schema.properties as Record<string, JsonSchema>)
					: {}
				const required = new Set(Array.isArray(schema.required) ? schema.required : [])
				const keySet = new Set<string>([...Object.keys(properties), ...required])
				const keys = orderObjectKeys(Array.from(keySet), ctx.pointer)
				const lines = keys.map((key) => {
					const propPointer = joinPointer(joinPointer(ctx.pointer, 'properties'), key)
					const propSchemaSource = properties[key]
					const useGetter = propSchemaSource
						? shouldUseGetterForSchema(ctx.currentRef, propSchemaSource)
						: false
					const propSchema = propSchemaSource
						? emitSchema(propSchemaSource, {
								stack: ctx.stack,
								pointer: propPointer,
								allowPrefault: false,
								currentRef: ctx.currentRef,
								directRef: useGetter,
							})
						: 'z.unknown()'
					const optional = required.has(key) ? '' : '.optional()'
					let fullSchema = `${propSchema}${optional}`
					if (propSchemaSource) {
						const describe = getDescribe(propSchemaSource)
						if (describe) {
							fullSchema = `${fullSchema}.describe(${JSON.stringify(describe)})`
						}
					}
					if (useGetter) {
						const getterBody = indent(`return ${fullSchema}`, 1)
						return `get ${JSON.stringify(key)}() {\n${getterBody}\n},`
					}
					return `${JSON.stringify(key)}: ${fullSchema},`
				})
				const shape = lines.length ? `\n${indent(lines.join('\n'))}\n` : ''
				const additional = schema.additionalProperties
				const hasAdditionalSchema = isObject(additional)
				const isAdditionalFalse = additional === false
				const objectConstructor = isAdditionalFalse ? 'z.strictObject' : 'z.looseObject'
				base = `${objectConstructor}({${shape}})`
				if (hasAdditionalSchema && Object.keys(additional as Record<string, unknown>).length > 0) {
					base = `${base}.catchall(${emitSchema(additional as JsonSchema, {
						...ctx,
						pointer: joinPointer(ctx.pointer, 'additionalProperties'),
						allowPrefault: false,
					})})`
				}
				if (schema.patternProperties || schema.propertyNames) {
					warn(
						'unsupported-pattern-properties',
						ctx.pointer,
						'Encountered patternProperties/propertyNames; emitted base object without extra enforcement.'
					)
				}
				break
			}
			case 'array':
				base = emitArray(schema, ctx)
				break
			default:
				base = 'z.any()'
		}
	} else if (nonNullTypes.length > 1) {
		const parts = nonNullTypes.map((type) => emitSchemaCore({ ...schema, type }, ctx))
		base = `z.union([${parts.join(', ')}])`
	} else {
		if (schema.properties || schema.additionalProperties) {
			base = emitSchemaCore({ ...schema, type: 'object' }, ctx)
		} else if (schema.items) {
			base = emitSchemaCore({ ...schema, type: 'array' }, ctx)
		} else {
			base = 'z.any()'
		}
	}

	return base
}

const emitSchema = (schema: JsonSchema, ctx: EmitContext): string => {
	if (ctx.stack.has(schema)) {
		return 'z.any()'
	}
	ctx.stack.add(schema)
	try {
		let base = emitSchemaCore(schema, ctx)
		if (isNullableSchema(schema)) {
			base = `${base}.nullable()`
		}
		return withDefault(base, schema, { allowPrefault: ctx.allowPrefault, pointer: ctx.pointer })
	} finally {
		ctx.stack.delete(schema)
	}
}

type ObjectPropertyEntry = {
	key: string
	required: boolean
	schema?: JsonSchema
}

const getObjectPropertyEntries = (schema: JsonSchema): ObjectPropertyEntry[] => {
	const properties = isObject(schema.properties)
		? (schema.properties as Record<string, JsonSchema>)
		: undefined
	if (!properties) return []

	const requiredList = (Array.isArray(schema.required) ? schema.required : []).filter(
		(value): value is string => typeof value === 'string'
	)
	const required = new Set(requiredList)

	const keys: string[] = []
	const seen = new Set<string>()
	for (const key of Object.keys(properties)) {
		keys.push(key)
		seen.add(key)
	}
	for (const key of requiredList) {
		if (seen.has(key)) continue
		keys.push(key)
		seen.add(key)
	}

	return keys.map((key) => ({
		key,
		required: required.has(key),
		schema: properties[key],
	}))
}

const emitDefinitionType = (name: string, schema: JsonSchema) => {
	const entries = getObjectPropertyEntries(schema)
	if (!entries.length) {
		return `export type ${name} = z.infer<typeof ${name}>`
	}

	const inferredName = `${name}Inferred`
	const lines = [
		`type ${inferredName} = z.infer<typeof ${name}>`,
		`export interface ${name} extends ${inferredName} {`,
	]
	for (const entry of entries) {
		const entryDoc = entry.schema ? buildDoc(entry.schema) : ''
		if (entryDoc) {
			lines.push(indent(entryDoc))
		}
		const optional = entry.required ? '' : '?'
		const typeRef = entry.schema ? `${inferredName}[${JSON.stringify(entry.key)}]` : 'unknown'
		lines.push(indent(`${JSON.stringify(entry.key)}${optional}: ${typeRef}`))
	}
	lines.push('}')
	return lines.join('\n')
}

const emitDefinitions = () => {
	const entries = Array.from(schemaByRef.entries()).sort(([a], [b]) => a.localeCompare(b))
	return entries
		.map(([ref, schema]) => {
			const name = nameByRef.get(ref) as string
			const expr = emitSchema(schema, {
				stack: new Set(),
				pointer: ref,
				allowPrefault: false,
				currentRef: ref,
			})
			const doc = buildDoc(schema)
			const prefix = doc ? `${doc}\n` : ''
			if (name === 'Json') {
				return `${prefix}export interface JsonObject { [key: string]: Json }\nexport type Json = string | number | boolean | null | Json[] | JsonObject\nexport const Json: z.ZodType<Json> = ${expr}\n`
			}
			const typeDef = emitDefinitionType(name, schema)
			return `${prefix}${typeDef}\nexport const ${name} = ${expr}\n`
		})
		.join('\n')
}

const definitions = emitDefinitions()
const helperBlocks: string[] = []

if (needsDeepEqual) {
	helperBlocks.push(
		`const deepEqual = (a: unknown, b: unknown): boolean => {\n\tif (a === b) return true\n\tif (typeof a !== typeof b) return false\n\tif (typeof a !== 'object' || a === null || b === null) return false\n\tif (Array.isArray(a) !== Array.isArray(b)) return false\n\tif (Array.isArray(a) && Array.isArray(b)) {\n\t\tif (a.length !== b.length) return false\n\t\tfor (let i = 0; i < a.length; i += 1) {\n\t\t\tif (!deepEqual(a[i], b[i])) return false\n\t\t}\n\t\treturn true\n\t}\n\tconst aKeys = Object.keys(a as Record<string, unknown>).sort()\n\tconst bKeys = Object.keys(b as Record<string, unknown>).sort()\n\tif (aKeys.length !== bKeys.length) return false\n\tfor (let i = 0; i < aKeys.length; i += 1) {\n\t\tif (aKeys[i] !== bKeys[i]) return false\n\t\tconst key = aKeys[i]\n\t\tif (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false\n\t}\n\treturn true\n}`
	)
}

if (needsUnique) {
	helperBlocks.push(
		`const isUnique = (values: unknown[]) => {\n\tfor (let i = 0; i < values.length; i += 1) {\n\t\tfor (let j = i + 1; j < values.length; j += 1) {\n\t\t\tif (deepEqual(values[i], values[j])) return false\n\t\t}\n\t}\n\treturn true\n}`
	)
}

if (needsOneOf) {
	helperBlocks.push(
		`const oneOf = (schemas: z.ZodType<unknown>[]) =>\n\tz.union(schemas).refine((value) => {\n\t\tconst matches = schemas.reduce(\n\t\t\t(count, schema) => count + (schema.safeParse(value).success ? 1 : 0),\n\t\t\t0\n\t\t)\n\t\treturn matches === 1\n\t}, { error: 'Expected exactly one schema to match' })`
	)
}

const helpers = helperBlocks.length ? `${helperBlocks.join('\n\n')}\n\n` : ''
const content = `import * as z from 'zod'\n\n${helpers}${definitions}`

await fs.writeFile(outputPath, content)

if (warnings.size > 0) {
	const lines = Array.from(warnings.values())
		.sort((a, b) => {
			if (a.code !== b.code) return a.code.localeCompare(b.code)
			if (a.pointer !== b.pointer) return a.pointer.localeCompare(b.pointer)
			return a.message.localeCompare(b.message)
		})
		.map((warning) => {
			const suffix = warning.count > 1 ? ` (x${warning.count})` : ''
			return `[${warning.code}] ${warning.pointer}: ${warning.message}${suffix}`
		})
	console.warn(`Generated with warnings:\n- ${lines.join('\n- ')}`)
}
