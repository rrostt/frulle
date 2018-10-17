const { sendMessage } = require('../../slackAdapter')

const handleCancelled = event =>
  sendMessage(event.channel, {
    text: 'Ok! Det är noterat att frukosten är inställd. Men kom ihåg att frulle är det viktigaste målet på dagen :cheese_wedge:'
  })

module.exports = handleCancelled
