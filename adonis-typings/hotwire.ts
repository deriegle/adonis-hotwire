/*
hi there
*/

declare module '@ioc:Adonis/Core/HttpContext' {
  import { ViewContract } from '@ioc:Adonis/Core/View'

  type Locals = Parameters<ViewContract['render']>[1]

  export interface PartialStreamOptions {
    locals?: Locals
    templatePath: string;
  }

  export interface ContentStreamOptions {
    locals?: Locals
    content: string;
  }

  export type StreamOptions = PartialStreamOptions | ContentStreamOptions

  export type TurboStreamFunction = (target: string, options?: StreamOptions) => Promise<void>

  interface HttpContextContract {
    turboStream: {
      append: TurboStreamFunction
      prepend: TurboStreamFunction
      replace: TurboStreamFunction
      update: TurboStreamFunction
      remove: TurboStreamFunction
    }
  }
}
