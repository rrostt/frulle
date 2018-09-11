const lists = require('../../lists')
const { resolveUser, sendMessage } = require('../slackAdapter')
const createMemberListAttachment = require('../utils/createMemberListAttachment')

const memberJoinedChannel = event =>
  lists.hasList(event.channel).then(hasList => {
    if (hasList) {
      return Promise.all([
        lists.isMemberInList(event.user, event.channel),
        resolveUser(event.user)
      ])
        .then(([inList, user]) => {
          if (inList) {
            return sendMessage(event.channel, { text: `Hej ${user.name}! Du är sedan tidigare i frukostlistan.` })
          } else {
            return resolveUser(event.user)
              .then(user =>
                lists.addMemberToList(user, event.channel)
                  .then(memberList =>
                    sendMessage(
                      event.channel,
                      {
                        text: `Hej ${user.name}! Du är nu med i frukostlistan. Hojta om du vill bli borttagen \`@frulle ta bort mig\``,
                        attachments: [
                          createMemberListAttachment(memberList)
                        ]
                      }
                    )
                  )
              )
          }
        })
    }
  })

module.exports = memberJoinedChannel
