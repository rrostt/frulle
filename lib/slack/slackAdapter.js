const axios = require('axios')

const botOauthToken = process.env.SLACK_BOT_OAUTH_TOKEN

const getChannelInfo = channelId =>
  axios.get('https://slack.com/api/channels.info', {
    params: {
      channel: channelId,
      token: botOauthToken
    },
    headers: {
      'Authorization': `Bearer ${botOauthToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.data.channel)

const getUsers = () =>
  axios.post('https://slack.com/api/users.list', {
    token: botOauthToken,
    limit: 100
  }, {
    headers: {
      'Authorization': `Bearer ${botOauthToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.data.members)

const resolveUsers = userIds => getUsers()
  .then(users => userIds.map(userId => users.filter(user => user.id === userId)[0]))

const resolveUser = userId => getUsers()
  .then(users => users.filter(user => user.id === userId)[0])

const sendMessage = (channel, { text, attachments = [] }) =>
  axios.post('https://slack.com/api/chat.postMessage', {
    channel,
    text,
    attachments
  }, {
    headers: {
      'Authorization': `Bearer ${botOauthToken}`,
      'Content-Type': 'application/json'
    }
  })

const postResponse = (responseUrl, { replace = false, text = '', attachments }) =>
  axios.post(responseUrl, {
    replace_original: replace,
    resopnse_type: 'in_channel',
    text,
    attachments
  }, {
    headers: {
      'Authorization': `Bearer ${botOauthToken}`,
      'Content-Type': 'application/json'
    }
  })

module.exports = {
  getUsers,
  getChannelInfo,
  resolveUser,
  resolveUsers,
  sendMessage,
  postResponse
}
