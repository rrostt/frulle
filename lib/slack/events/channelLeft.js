const lists = require('../../lists')
const { sendMessage } = require('../slackAdapter')

const channelLeft = event => {
  return lists.hasList(event.channel)
    .then(hasList => {
      if (hasList) {
        return lists.deleteList(event.channel)
          .then(_ =>
            sendMessage(event.channel, { text: 'Listan borttagen' })
          )
      }
    })
}

module.exports = channelLeft
