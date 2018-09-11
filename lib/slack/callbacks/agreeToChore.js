const getPayloadValueData = require('../utils/getPayloadValueData')
const { postResponse } = require('../slackAdapter')
const createNextPersonMessage = require('../utils/createNextPersonMessage')
const lists = require('../../lists')

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

module.exports = agreeToChore
