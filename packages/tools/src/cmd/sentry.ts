import { Command } from '@commander-js/extra-typings'

import { z } from '@repo/zod'

import { getConfig } from '../config'
import { shouldRemoveSourcemapsBeforeDeploy } from '../package'
import { timeFn } from '../time'

export const sentryCmd = new Command('sentry')
	.description('Manage Sentry for releases')
	.option('-o, --org <org>', 'Sentry org to use', 'sentry')

export type ProjectName = z.infer<typeof ProjectName>
export const ProjectName = z.string().regex(/^[a-z\d_-]+$/i)

sentryCmd
	.command('commits')
	.description('Set commits for the release')
	.argument('<project>', 'Sentry project to set commits for', (p) => ProjectName.parse(p))
	.action(async (project) => {
		const { org } = sentryCmd.opts()
		echo(chalk.blue(`Sentry project: ${project}`))
		const cfg = await getConfig()
		echo(chalk.blue(`Sentry version: ${cfg.version}`))

		await retry(
			3,
			'1s',
			timeFn('sentry commits', () =>
				$`sentry-cli releases set-commits ${cfg.version} --auto --ignore-missing --org ${org} --project ${project}`.verbose()
			)
		)
	})

sentryCmd
	.command('sourcemaps')
	.description('Upload sourcemaps for the release')
	.argument('<project>', 'Sentry project to upload sourcemaps for', (p) => ProjectName.parse(p))
	.action(async (project) => {
		const { org } = sentryCmd.opts()
		echo(chalk.blue(`Sentry project: ${project}`))
		const [cfg, shouldRemoveSourcemaps] = await Promise.all([
			getConfig(),
			shouldRemoveSourcemapsBeforeDeploy(),
		])
		echo(chalk.blue(`Sentry version: ${cfg.version}`))

		if (shouldRemoveSourcemaps) {
			echo(chalk.blue('framework with sourcemaps detected! copying dist2 back to dist'))
			await fs.rm('dist', { force: true, recursive: true })
			await fs.move('dist2', 'dist')
		}

		await retry(
			3,
			'1s',
			timeFn('sentry sourcemaps', () =>
				$`sentry-cli sourcemaps upload ./dist/ --strip-prefix './dist/../' --release ${cfg.version} --org ${org} --project ${project}`.verbose()
			)
		)
	})

sentryCmd
	.command('finalize')
	.description('Finalize the release')
	.argument('<project>', 'Sentry project to finalize release for', (p) => ProjectName.parse(p))
	.action(async (project) => {
		const { org } = sentryCmd.opts()
		echo(chalk.blue(`Sentry project: ${project}`))
		const cfg = await getConfig()
		echo(chalk.blue(`Sentry version: ${cfg.version}`))

		await retry(
			3,
			'1s',
			timeFn('sentry finalize', () =>
				$`sentry-cli releases finalize ${cfg.version} --org ${org} --project ${project}`.verbose()
			)
		)
	})
