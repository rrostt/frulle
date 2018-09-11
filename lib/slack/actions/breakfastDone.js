const lists = require('../../lists')
const { sendMessage } = require('../slackAdapter')

const breakfastDone = event =>
  lists.getAssignedMember(event.channel)
    .then(userId => {
      if (userId) {
        return sendMessage(event.channel, {
          text: `Hoppas ni fick en god frukost! Stämmer det att <@${userId}> fixade frukosten så jag kan lägga hen sist i listan.`,
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
                    user: userId,
                    channel: event.channel
                  })
                },
                {
                  name: 'answer',
                  text: 'Nej',
                  type: 'button',
                  value: JSON.stringify({
                    verified: false,
                    user: userId,
                    channel: event.channel
                  })
                }
              ]
            }
          ]
        })
      } else {
        return sendMessage(event.channel, {
          text: `Har ni haft frukost? Ingen verkar bekräftat att de skulle fixa frukost. Ange gärna genom att säga \`@frulle @anvandare fixade\``
        })
      }
    })

module.exports = breakfastDone
