const { resolveUser, sendMessage } = require('../../slackAdapter')
const getMentions = require('../../utils/getMentions')

const handleRemoveUser = event => getMentions(event.text)
  .then(users => (users && users[0]) || resolveUser(event.user))
  .then(user => sendMessage(event.channel, {
    text: `Ska jag ta bort ${user.name}`,
    attachments: [
      {
        text: '',
        callback_id: 'remove_user',
        color: '#0f0',
        attachment_type: 'default',
        actions: [
          {
            name: 'answer',
            text: 'Ja ta bort',
            type: 'button',
            value: JSON.stringify({
              user: user.id,
              channel: event.channel
            })
          },
          {
            name: 'answer',
            text: 'Nej',
            type: 'button',
            value: JSON.stringify({})
          }
        ]
      }
    ]
  }))

module.exports = handleRemoveUser
