const lists = require('../../lists')
const createMemberListAttachment = require('../utils/createMemberListAttachment')
const { resolveUser, resolveUsers, sendMessage } = require('../slackAdapter')
const planBreakfast = require('../actions/planBreakfast')
const breakfastDone = require('../actions/breakfastDone')

const getMentions = text => {
  const regexp = /<@([^>]*?)>/gi
  const find = () => {
    const result = regexp.exec(text)
    if (!result) return []
    else return [result[1]].concat(find())
  }
  return resolveUsers(find())
    .then(users => users.filter(({ is_bot: isBot }) => !isBot))
}

const handleShowList = event =>
  lists.getMembers(event.channel)
    .then(members =>
      sendMessage(event.channel, {
        // title: 'De här är med i listan',
        // attachments: [createMemberListAttachment(members)]
        ...createMemberListAttachment(members)
      })
    )

const handleRemoveUser = event =>
  getMentions(event.text)
    .then(users => (users && users[0]) || resolveUser(event.user))
    .then(user =>
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
                  user: user.id,
                  channel: event.channel
                })
              },
              {
                name: 'answer',
                text: 'Nej',
                type: 'button',
                value: JSON.stringify({
                })
              }
            ]
          }
        ]
      })
    )

const handleAddUser = event =>
  getMentions(event.text)
    .then(users => (users && users[0]) || resolveUser(event.user))
    .then(user =>
      lists.isMemberInList(user.id, event.channel)
        .then((inList) => {
          if (inList) {
            return sendMessage(event.channel, { text: `Hej <@${user.id}>! Du är sedan tidigare i frukostlistan.` })
          } else {
            return lists.addMemberToList(user, event.channel)
              .then(memberList =>
                sendMessage(
                  event.channel, {
                    text: `Hej <@${user.id}>! Du är nu med i frukostlistan. Hojta om du vill bli borttagen \`@frulle ta bort mig\``,
                    attachments: [
                      createMemberListAttachment(memberList)
                    ]
                  }
                )
              )
          }
        })
    )

const handleWhoFixedBreakfast = event =>
  getMentions(event.text)
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

const handleChangeAssignee = event =>
  lists.unassignMember(event.channel)
    .then(_ => planBreakfast(event))

const handleDefault = event =>
  sendMessage(event.channel, { text: 'Hej, den här kanalen har en frukostlista.' })

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
    action: planBreakfast
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
  },
  {
    test: /list/,
    action: handleShowList
  },
  {
    test: new RegExp(), // matches everything
    action: handleDefault
  }
]

const appMention = (event) => {
  console.log('app_mention')
  return lists.hasList(event.channel).then(hasList => {
    if (hasList) {
      const actionToPerform = textActions.find(({ test }) => test.test(event.text))
      return actionToPerform.action(event)
    } else {
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

module.exports = appMention
