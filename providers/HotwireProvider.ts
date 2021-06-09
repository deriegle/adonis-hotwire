import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ViewContract } from '@ioc:Adonis/Core/View'
import {
  HttpContextContract,
  StreamOptions,
  ContentStreamOptions,
  TurboStreamFunction,
} from '@ioc:Adonis/Core/HttpContext'

const isContentStreamOptions = (options: StreamOptions): options is ContentStreamOptions =>
  typeof (options as ContentStreamOptions).content === 'string'

const getContentFromOptions = async (view: ViewContract, options?: StreamOptions) => {
  if (!options) {
    return ''
  }

  const content = isContentStreamOptions(options)
    ? await view.renderRaw(options.content, options.locals)
    : await view.render(options.templatePath, options.locals)

  return content
}

const stream = async (
  view: ViewContract,
  target: string,
  action: keyof HttpContextContract['turboStream'],
  options?: StreamOptions
): Promise<string> => {
  const content = await getContentFromOptions(view, options)

  return `
  <turbo-stream action="${action}" target="${target}">
    <template>
      ${content}
    </template>
  </turbo-stream>
  `
}

const streamActionHandler = (
  action: keyof HttpContextContract['turboStream'],
  { response }: HttpContextContract,
  view: ViewContract,
): TurboStreamFunction => {
  return async (target: string, options?: StreamOptions): Promise<void> => {
    response.header('Content-Type', 'text/vnd.turbo-stream.html; charset=utf-8')
    response.status(200)
    response.send(await stream(view, target, action, options))
  }
}

export const buildTurboStream = (
  httpContext: HttpContextContract,
  view: ViewContract,
): HttpContextContract['turboStream'] => {
  return {
    append: streamActionHandler('append', httpContext, view),
    prepend: streamActionHandler('prepend', httpContext, view),
    remove: streamActionHandler('remove', httpContext, view),
    replace: streamActionHandler('replace', httpContext, view),
    update: streamActionHandler('update', httpContext, view),
  }
}

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class HotwireProvider {
  public static needsApplication = true
  constructor (protected application: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // All bindings are ready, feel free to use them
    this.application.container.withBindings(
      [
        'Adonis/Core/HttpContext',
        'Adonis/Core/View',
      ],
      (httpContext, view) => {
        httpContext.getter(
          'turboStream',
          function() {
            return buildTurboStream(this, view)
          }
        )
      }
    )
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
