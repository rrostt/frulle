const { resolveUsers, getChannelInfo, postResponse } = require('../slackAdapter')
const createMemberListAttachment = require('../utils/createMemberListAttachment')
const lists = require('../../lists')

const createList = payload => {
  if (payload.actions[0].value === 'yes') {
    return getChannelInfo(payload.channel.id)
      .then(info => info.members)
      .then(members => resolveUsers(members))
      .then(users => users.filter(({ is_bot: isBot }) => !isBot))
      .then(members =>
        lists.createList(payload.channel.id, members)
          .then(listMembers =>
            postResponse(payload.response_url, {
              text: 'Ok, frukostlista skapad!',
              replace: true,
              attachments: [createMemberListAttachment(listMembers)]
            })
          )
      )
  } else {
    return postResponse(payload.response_url, { text: 'Oki, då skippar vi att skapa en lista. Ångrar du dig så åberopa mig igen! Du kan slänga ut mig med `/kick @frulle`', replace: true })
  }
}

module.exports = createList
