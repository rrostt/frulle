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

module.exports = (event) => {
  console.log(event)
  const eventAction = events[event.type]
  if (eventAction) {
    return eventAction(event)
  } else {
    return Promise.reject(new Error('no handler for event type'))
  }
}
