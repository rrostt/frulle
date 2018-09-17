const lists = require('../../lists')
const { resolveUser, sendMessage } = require('../slackAdapter')

const memberLeftChannel = event => {
  return lists.hasList(event.channel).then(hasList => {
    if (hasList) {
      return Promise.all([
        lists.isMemberInList(event.user, event.channel),
        resolveUser(event.user)
      ])
        .then(([inList, user]) =>
          inList && sendMessage(
            event.channel,
            {
              text: `Ska jag ta bort ${user.name} från listan?`,
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
                        user: event.user,
                        channel: event.channel
                      })
                    },
                    {
                      name: 'answer',
                      text: 'Nej',
                      type: 'button',
                      value: ''
                    }
                  ]
                }
              ]
            }
          )
        )
    }
  })
}

module.exports = memberLeftChannel
