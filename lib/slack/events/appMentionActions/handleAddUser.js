const lists = require('../../../lists')
const createMemberListAttachment = require('../../utils/createMemberListAttachment')
const { resolveUser, sendMessage } = require('../../slackAdapter')
const getMentions = require('../../utils/getMentions')

const handleAddUser = event => getMentions(event.text)
  .then(users => (users && users[0]) || resolveUser(event.user))
  .then(user => lists.isMemberInList(user.id, event.channel)
    .then((inList) => {
      if (inList) {
        return sendMessage(event.channel, { text: `Hej <@${user.id}>! Du är sedan tidigare i frukostlistan.` })
      } else {
        return lists.addMemberToList(user, event.channel)
          .then(memberList => sendMessage(event.channel, {
            text: `Hej <@${user.id}>! Du är nu med i frukostlistan. Hojta om du vill bli borttagen \`@frulle ta bort mig\``,
            attachments: [
              createMemberListAttachment(memberList)
            ]
          }))
      }
    }))

module.exports = handleAddUser
