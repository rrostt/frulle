const message = require('./events/message')
const appMention = require('./events/appMention')
const memberJoinedChannel = require('./events/memberJoinedChannel')
const memberLeftChannel = require('./events/memberLeftChannel')

const events = {
  'message': message,
  'app_mention': appMention,
  'member_joined_channel': memberJoinedChannel,
  'member_left_channel': memberLeftChannel
}

module.exports = (req, res) => {
  const { token, challenge, type, event } = req.body
  console.log('event', { token, challenge, type })

  if (type === 'url_verification') {
    res.status(200).send(challenge)
  } else {
    console.log(event)
    const eventAction = events[event.type]
    if (eventAction) {
      return eventAction(event)
        .then(_ => {
          res.sendStatus(200)
        })
    }
  }
}
