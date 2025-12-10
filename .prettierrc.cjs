// @ts-check

const codeImports = [
	// Groups
	'<BUILTIN_MODULES>',
	'<THIRD_PARTY_MODULES>',
	'',
	'^(@repo)(\\/.*)$', // Workspace imports
	'',
	// aliases
	'^~\\/', // ~/
	'^@\\/', // @/
	'',
	// Local (relative) imports
	'^[.]{2}$', // ..
	'^[.]{2}\\/', // ../
	'^[.]\\/(?!index)', // ./foo (but not ./index)
	'^[.]$', // .
	'^[.]\\/index$', // ./index
	'',
]

// Type imports are ordered the same way, but without separators.
// We also need a catch-all <TYPES> here to prevent prettier from failing.
const typeImports = ['<TYPES>'].concat(
	codeImports.filter((i) => i !== '').map((i) => `<TYPES>${i}`)
)

/** @type {import("prettier").Config} */
const config = {
	trailingComma: 'es5',
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	printWidth: 100,
	plugins: [
		'@babel/plugin-transform-explicit-resource-management',
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-packagejson',
		'prettier-plugin-toml',
	],
	importOrder: [...codeImports, ...typeImports],
	importOrderParserPlugins: ['typescript', 'jsx', 'explicitResourceManagement'],
	importOrderTypeScriptVersion: '5.8.2',
	overrides: [
		{
			files: ['*.jsonc', '*.code-workspace'],
			options: {
				trailingComma: 'none',
			},
		},
		{
			files: 'Justfile',
			options: {
				useTabs: false,
			},
		},
		{
			files: '*.md',
			options: {
				useTabs: false,
			},
		},
		{
			files: ['mise.toml', '.mise.toml'],
			options: {
				alignEntries: true,
			},
		},
	],
}

module.exports = config
