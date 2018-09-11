const createMemberListAttachment = require('./utils/createMemberListAttachment')
const createNextPersonMessage = require('./utils/createNextPersonMessage')
const { postResponse, getChannelInfo, resolveUsers } = require('./slackAdapter')
const lists = require('../lists')

const getPayloadValueData = payload => {
  const value = payload.actions[0].value
  return value ? JSON.parse(value) : {}
}

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

const removeUser = payload => {
  const { channel, user } = getPayloadValueData(payload)
  if (channel && user) {
    return lists.removeMemberFromList(user, channel)
      .then(listMembers =>
        postResponse(payload.response_url, {
          text: 'Ok, användare borttagen',
          replace: true,
          attachments: [createMemberListAttachment(listMembers)]
        })
      )
  } else {
    return postResponse(payload.response_url, { text: '', replace: true })
  }
}

const agreeToChore = payload => {
  const { channel, user, position, agreed } = getPayloadValueData(payload)
  if (agreed) {
    return lists.assignMember(user, channel)
      .then(_ =>
        postResponse(payload.response_url, {
          text: `Awesome! <@${user}> fixar frulle!`,
          replace: true
        })
      )
  } else {
    return lists.getNextInList(channel, position)
      .then(member => {
        if (!member) {
          return postResponse(payload.response_url, {
            text: 'Blir tyvärr ingen frukost imorgon för ingen kan :(',
            replace: true
          })
        }

        return postResponse(payload.response_url, createNextPersonMessage(member, channel))
      })
  }
}

const verifyDidChore = payload => {
  const { verified, channel, user } = getPayloadValueData(payload)
  if (verified) {
    return lists.setMemberLastInList(user, channel)
      .then(memberList =>
        lists.unassignMember(channel)
          .then(_ =>
            postResponse(payload.response_url, {
              text: `Perfekt! <@${user}> är nu sist i listan.`,
              attachments: [createMemberListAttachment(memberList)],
              replace: true
            })
          )
      )
  } else {
    return postResponse(payload.response_url, {
      text: `Aj då! Vem var det då som fixade frukosten? Bekräfta genom att säga \`@frulle @anvandare fixade\``,
      replace: true
    })
  }
}

module.exports = (req, res) => {
  const payload = JSON.parse(req.body.payload)
  console.log('payload', payload)

  switch (payload.callback_id) {
    case 'create_list':
      createList(payload)
        .then(_ => {
          res.status(200).send('')
        })
      break
    case 'remove_user':
      removeUser(payload)
        .then(_ => {
          res.status(200).send('')
        })
      break
    case 'agree_to_chore':
      agreeToChore(payload)
        .then(_ => {
          res.status(200).send('')
        })
      break
    case 'verify_did_chore':
      verifyDidChore(payload)
        .then(_ => {
          res.status(200).send('')
        })
      break
  }
}
