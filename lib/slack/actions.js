const lists = require('../lists')
const { sendMessage } = require('./slackAdapter')
const createNextPersonMessage = require('./utils/createNextPersonMessage')

const whoIsNext = event =>
  lists.getAssignedMember(event.channel)
    .then(assignedMember => {
      if (!assignedMember) {
        return lists.getNextInList(event.channel, -1)
          .then(member =>
            sendMessage(
              event.channel,
              createNextPersonMessage(
                member,
                event.channel,
                `Nu är det dags att bestämma vem som ska fixa frukost igen! Först i listan är <@${member.userId}>.`)
            )
          )
      } else {
        return sendMessage(event.channel, {
          text: `Den här veckan är det <@${assignedMember}> som fixar frukost! (Om det inte stämmer så säg \`@frulle ändra\`)`
        })
      }
    })

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

module.exports = {
  whoIsNext,
  breakfastDone
}
