# Adonis Hotwire

Adonis v5 package for interacting with [hotwire](https://turbo.hotwire.dev/).

## Installation

```bash
npm i adonis-hotwire @hotwired/turbo stimulus
node ace configure adonis-hotwire
```

## Making a Stimulus Controller

There is an included command for generating new stimulus controllers. The new controller will be generating in the `resources/js/controllers/` folder.

```bash
node ace make:stimulus_controller <controller_name>
```

## In your controller

You'll have access to an additional object in the `HttpContextContract` for interacting with turbo streams.
This object will provide methods for `append`, `prepend`, `replace`, `update` and `remove` actions.

You can read more about their uses in the [Turbo Stream Handbook](https://turbo.hotwire.dev/handbook/streams).

Example:

```typescript
class MessagesController {
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
}
```

## Additional Documentation
Check out the `example/` directory in the Github repo for an example of using the `adonis-hotwire` package.


