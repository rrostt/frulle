const getPayloadValueData = require('../utils/getPayloadValueData')
const { postResponse } = require('../slackAdapter')
const createMemberListAttachment = require('../utils/createMemberListAttachment')
const lists = require('../../lists')

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

module.exports = removeUser
