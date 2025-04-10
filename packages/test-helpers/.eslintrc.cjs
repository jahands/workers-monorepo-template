/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	ignorePatterns: 'scripts/build.mjs',
	extends: ['@repo/eslint-config/default.cjs'],
}
