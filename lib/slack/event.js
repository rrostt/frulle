const { sendMessage, resolveUser, resolveUsers } = require('./slackAdapter')
const createMemberListAttachment = require('./utils/createMemberListAttachment')
const {
  breakfastDone,
  whoIsNext
} = require('./actions')

const lists = require('../lists')

const getMentions = text => {
  const regexp = /<@([^>]*?)>/gi
  const find = () => {
    const result = regexp.exec(text)
    if (!result) return []
    else return [result[1]].concat(find())
  }
  return resolveUsers(find())
}

const message = event => {
  console.log('event body', event)
  if (event.username !== 'Frulle') {
    return sendMessage(event.channel, { text: 'heeeej' })
  }
  return Promise.resolve()
}

const handleRemoveUser = event =>
  resolveUser(event.user)
    .then(user => {
      sendMessage(event.channel, {
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
      })
    })

const handleAddUser = event =>
  Promise.all([
    lists.isMemberInList(event.user, event.channel),
    resolveUser(event.user)
  ])
    .then(([inList, user]) => {
      if (inList) {
        sendMessage(event.channel, { text: `Hej <@${event.user}>! Du är sedan tidigare i frukostlistan.` })
      } else {
        resolveUser(event.user)
          .then(user =>
            lists.addMemberToList(user, event.channel)
              .then(memberList => {
                sendMessage(
                  event.channel, {
                    text: `Hej <@${event.user}>! Du är nu med i frukostlistan. Hojta om du vill bli borttagen \`@frulle ta bort mig\``,
                    attachments: [
                      createMemberListAttachment(memberList)
                    ]
                  }
                )
              })
          )
      }
    })

const handleWhoFixedBreakfast = event => {
  getMentions(event.text)
    .then(users => users.filter(({ is_bot: isBot }) => !isBot))
    .then(users => {
      if (users.length) {
        const user = users[0]
        sendMessage(event.channel, {
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
}

const handleChangeAssignee = event =>
  lists.unassignMember(event.channel)
    .then(_ => whoIsNext(event))

const textActions = [
  {
    test: /ta bort/,
    action: handleRemoveUser
  },
  {
    test: /lägg till/,
    action: handleAddUser
  },
  {
    test: /vem/,
    action: whoIsNext
  },
  {
    test: /klar/,
    action: breakfastDone
  },
  {
    test: /fixade/,
    action: handleWhoFixedBreakfast
  },
  {
    test: /ändra/,
    action: handleChangeAssignee
  }
]

const appMention = (event) => {
  console.log('app_mention')
  return lists.hasList(event.channel).then(hasList => {
    if (hasList) {
      console.log('has list apparently')
      const actionToPerform = textActions.find(({ test }) => test.test(event.text))
      if (actionToPerform) {
        return actionToPerform.action(event)
      } else {
        return sendMessage(event.channel, { text: 'Hej, den här kanalen har en frukostlista.' })
      }
    } else {
      console.log('channel has no list so will prompt about creating one')
      return sendMessage(event.channel, {
        text: 'Hej, vill du att jag startar en frukostlista?',
        attachments: [
          {
            text: '',
            callback_id: 'create_list',
            color: '#0f0',
            attachment_type: 'default',
            actions: [
              {
                name: 'answer',
                text: 'Ja tack',
                type: 'button',
                value: 'yes'
              },
              {
                name: 'answer',
                text: 'Nej',
                type: 'button',
                value: 'no'
              }
            ]
          }
        ]
      })
    }
  })
  .catch(error => console.log('error processing appMention', error.message))
}

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
                  .then(memberList => {
                    sendMessage(
                      event.channel,
                      {
                        text: `Hej ${user.name}! Du är nu med i frukostlistan. Hojta om du vill bli borttagen \`@frulle ta bort mig\``,
                        attachments: [
                          createMemberListAttachment(memberList)
                        ]
                      }
                    )
                  })
              )
          }
        })
    }
  })

const memberLeftChannel = event => {
  return lists.hasList(event.channel).then(hasList => {
    if (hasList) {
      Promise.all([
        lists.isMemberInList(event.user, event.channel),
        resolveUser(event.user)
      ])
        .then(([inList, user]) =>
          sendMessage(
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

module.exports = (req, res) => {
  const { token, challenge, type, event } = req.body
  console.log('event', { token, challenge, type })

  if (type === 'url_verification') {
    res.status(200).send(challenge)
  } else {
    console.log(event)
    switch (event.type) {
      case 'message':
        message(event)
          .then(_ => {
            res.sendStatus(200)
          })
        break
      case 'app_mention':
        appMention(event)
          .then(_ => {
            res.sendStatus(200)
          })
        break
      case 'member_joined_channel':
        memberJoinedChannel(event)
          .then(_ => {
            res.sendStatus(200)
          })
        break
      case 'member_left_channel':
        memberLeftChannel(event)
          .then(_ => {
            res.sendStatus(200)
          })
        break
    }
  }
}
