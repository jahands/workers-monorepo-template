export interface Answers {
	name: string
	uploadSecrets: YesNo
	useAuth: YesNo
	appsDir: AppsDir
	turbo: Turbo
}

export interface WorkflowsAnswers {
	name: string
	uploadSecrets: YesNo
	appsDir: AppsDir
	workflowName: string
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

type AppsDir = 'apps' | 'apps2'
type YesNo = 'yes' | 'no'
