const lists = require('../../../lists')
const createMemberListAttachment = require('../../utils/createMemberListAttachment')
const { sendMessage } = require('../../slackAdapter')

const handleShowList = event =>
  lists.getMembers(event.channel)
    .then(members =>
      sendMessage(event.channel, {
        // title: 'De här är med i listan',
        // attachments: [createMemberListAttachment(members)]
        ...createMemberListAttachment(members)
      })
    )

module.exports = handleShowList
