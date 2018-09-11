const lists = require('../../lists')
const { sendMessage } = require('../slackAdapter')
const createNextPersonMessage = require('../utils/createNextPersonMessage')

const planBreakfast = event =>
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

module.exports = planBreakfast
