// @ts-check

const codeImports = [
	// Groups
	'<BUILTIN_MODULES>',
	'<THIRD_PARTY_MODULES>',
	'',
	'^(@repo|@wci)(/.*)$', // Workspace imports
	'',
	// Local (relative) imports
	'^[.]{2}$', // ..
	'^[.]{2}/', // ../
	'^[.]/(?!index)', // ./foo (but not ./index)
	'^[.]$', // .
	'^[.]/index$', // ./index
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
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-packagejson',
		'prettier-plugin-astro',
		'prettier-plugin-tailwindcss',
	],
	importOrder: [...codeImports, ...typeImports],
	importOrderTypeScriptVersion: '5.5.4',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
		{
			files: '*.mdx',
			options: {
				parser: 'mdx',
			},
		},
		{
			files: ['*.jsonc', '*.code-workspace'],
			options: {
				trailingComma: 'none',
			},
		},
		{
			files: ['**/snippets/stylus/**/*.css'],
			options: {
				useTabs: false,
			},
		},
		{
			files: 'Justfile',
			options: {
				useTabs: false,
			},
		},
	],
}

module.exports = config
