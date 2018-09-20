const lists = require('../../lists')
const { sendMessage } = require('../../slack/slackAdapter')
const planBreakfast = require('../actions/planBreakfast')
const breakfastDone = require('../actions/breakfastDone')

const handleChangeAssignee = require('./appMentionActions/handleChangeAssignee')
const handleWhoFixedBreakfast = require('./appMentionActions/handleWhoFixedBreakfast')
const handleAddUser = require('./appMentionActions/handleAddUser')
const handleRemoveUser = require('./appMentionActions/handleRemoveUser')
const handleShowList = require('./appMentionActions/handleShowList')

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
