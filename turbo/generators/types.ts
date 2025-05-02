export interface Answers {
	name: string
	turbo: Turbo
}

export interface WorkflowsAnswers {
	name: string
	turbo: Turbo
}

export interface Turbo {
	paths: Paths
}

export interface Paths {
	cwd: string
	root: string
	workspace: string
}
