import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'

export default class MessagesController {
  public async index({ view }: HttpContextContract) {
    const messages = await Message
      .query()
      .orderBy('createdAt', 'asc')
      .select('*')

    return view.render('messages/index', {
      messages,
    })
  }

  public async create({ request, turboStream }: HttpContextContract) {
    const { content } = request.body()

    const message = await Message.create({
      content,
    })

    turboStream.append('messages', {
      templatePath: 'messages/show',
      locals: {
        message,
      },
    })
  }

  public async edit({ request, view }: HttpContextContract) {
    const { messageId } = request.params()
    const message = await Message.findByOrFail('id', messageId)

    return view.render('messages/edit', {
      message,
    })
  }

  public async update({ request, view }: HttpContextContract) {
    const { messageId } = request.params()
    const { content } = request.body()

    const message = await Message.findByOrFail('id', messageId)

    message.content = content

    return view.render('messages/show', {
      message,
    })
  }

  public async delete({ request, turboStream }: HttpContextContract) {
    const { messageId } = request.params()

    const message = await Message.findByOrFail('id', messageId)

    await message.delete()

    turboStream.remove(`message_${messageId}`)
  }
}
