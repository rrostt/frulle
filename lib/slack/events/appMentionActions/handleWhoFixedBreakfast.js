const { sendMessage } = require('../../slackAdapter')
const getMentions = require('../../utils/getMentions')

const handleWhoFixedBreakfast = event => getMentions(event.text)
  .then(users => {
    if (users.length) {
      const user = users[0]
      return sendMessage(event.channel, {
        text: `Aha, fixade <@${user.id}> frulle?`,
        attachments: [
          {
            text: '',
            callback_id: 'verify_did_chore',
            color: '#0f0',
            attachment_type: 'default',
            actions: [
              {
                name: 'answer',
                text: 'Japp!',
                type: 'button',
                value: JSON.stringify({
                  verified: true,
                  user: user.id,
                  channel: event.channel
                })
              },
              {
                name: 'answer',
                text: 'Nej',
                type: 'button',
                value: JSON.stringify({
                  verified: false,
                  user: user.id,
                  channel: event.channel
                })
              }
            ]
          }
        ]
      })
    }
  })

module.exports = handleWhoFixedBreakfast
