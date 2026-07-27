// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
	indent: '\t',
	versionGroups: [
		{
			// url is not supported so we need to exclude it
			// to allow using deps from pkg.pr.new
			label: 'ignore url specifiers',
			specifierTypes: ['url'],
		},
		{
			label: 'local packages',
			packages: ['**'],
			dependencies: ['$LOCAL'],
			dependencyTypes: ['!local'], // Exclude the local package itself
			pinVersion: 'workspace:*',
		},
	],
	semverGroups: [
		{
			label: 'pin all deps',
			range: '',
			dependencies: ['**'],
			packages: ['**'],
			specifierTypes: [
				// url is not supported so we need to exclude it
				// to allow using deps from pkg.pr.new (though this is
				// not recommended because pnpm will error when a package
				// at the same URL changes without a version bump, which
				// is common for pkg.pr.new - use with caution).
				'!url',
			],
		},
	],
}

module.exports = config
