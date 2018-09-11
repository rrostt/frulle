const getPayloadValueData = require('../utils/getPayloadValueData')
const { postResponse } = require('../slackAdapter')
const createMemberListAttachment = require('../utils/createMemberListAttachment')
const lists = require('../../lists')

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

module.exports = verifyDidChore
