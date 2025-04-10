export const partials = {
	useAuth: {
		type: `
	/** API token for authing to this Worker */
	API_TOKEN: string
`,
		middleware: `
	// Auth all routes
	.use('*', async (c, next) =>
		useAuth({
			token: c.env.API_TOKEN,
			bearerAuth: true,
		})(c, next)
	)
`,
		import: `	useAuth,
`,
	},
}
