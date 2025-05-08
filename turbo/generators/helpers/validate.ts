export function nameValidator(value: string) {
	if (!/^[a-z][a-z0-9-]*$/.test(value)) {
		return 'Must start with a letter and contain only lowercase letters, numbers, and hyphens'
	}
	return true
}
