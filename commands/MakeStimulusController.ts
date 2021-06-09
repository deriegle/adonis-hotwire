import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { string } from '@poppinss/utils/build/helpers'

export default class MakeStimulusController extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:stimulus_controller'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Make a new Stimulus Controller'

  @args.string({ description: 'Name of the Stimulus Controller'})
  public name: string

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  public async run() {
    const stub = join(__dirname, '..', 'templates', 'StimulusController.txt')

    this.generator
      .addFile(this.name, { pattern: 'snakecase', form: 'singular', extname: '.js', suffix: 'Controller' })
      .stub(stub)
      .useMustache()
      .destinationDir(this.application.resourcesPath('js', 'controllers'))
      .appRoot(this.application.cliCwd || this.application.appRoot)
      .apply({
        filename: this.buildFilename(),
      })

    await this.generator.run()
  }

  private buildFilename(): string {
    const pascalName = string.pascalCase(this.name)
    return pascalName.toLowerCase().endsWith('controller') ? pascalName: `${pascalName}Controller`
  }
}
