import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

const REQUIRED_DEPENDENCIES = [
  '@hotwired/turbo',
  'stimulus',
]

export default async function instructions(
  projectRoot: string,
  _app: ApplicationContract,
  sink: typeof sinkStatic
) {
  const packageJson = new sink.files.PackageJsonFile(projectRoot)
  const dependencies = Object.keys(packageJson.get().dependencies)

  REQUIRED_DEPENDENCIES.forEach((dependency) => {
    if (!dependencies.includes(dependency)) {
      packageJson.install(dependency, undefined, false)
    }
  })

  const packagesToInstall = packageJson.getInstalls().list

  if (!packagesToInstall.length) {
    return
  }

  const spinner = sink.logger.await(`Installing ${sink.logger.colors.grey(packagesToInstall.join(', '))}`)

  try {
    spinner.start()
    packageJson.commit()
    spinner.update('Packages Installed.')
  } catch (err) {
    spinner.update('Failed to install packages.')
    sink.logger.fatal(err)
  }

  spinner.stop()
}
