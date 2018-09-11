const { sendMessage } = require('../slackAdapter')

const message = event => {
  console.log('event body', event)
  if (event.username !== 'Frulle') {
    return sendMessage(event.channel, { text: 'heeeej' })
  }
  return Promise.resolve()
}

module.exports = message
