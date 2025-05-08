import { z } from '@repo/workspace-dependencies/zod'

export type Paths = z.infer<typeof Paths>
export const Paths = z.object({
	cwd: z.string(),
	root: z.string(),
	workspace: z.string(),
})

export type Turbo = z.infer<typeof Turbo>
export const Turbo = z.object({
	paths: Paths,
})

export type NewWorkerAnswers = z.infer<typeof NewWorkerAnswers>
export const NewWorkerAnswers = z.object({
	name: z.string(),
	turbo: Turbo,
})

export type NewPackageAnswers = z.infer<typeof NewPackageAnswers>
export const NewPackageAnswers = z.object({
	name: z.string(),
	turbo: Turbo,
	usedInWorkers: z.boolean().optional(),
})

export type Answers = z.infer<typeof Answers>
export const Answers = z.union([NewWorkerAnswers, NewPackageAnswers])
