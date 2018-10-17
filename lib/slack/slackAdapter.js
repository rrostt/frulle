const axios = require('axios')

const botOauthToken = process.env.SLACK_BOT_OAUTH_TOKEN
const slackHost = process.env.SLACK_HOST || 'https://slack.com'
const headers = {
  'Authorization': `Bearer ${botOauthToken}`,
  'Content-Type': 'application/json'
}

const getChannelInfo = channelId =>
  axios.get(`${slackHost}/api/channels.info`, {
    params: {
      channel: channelId,
      token: botOauthToken
    },
    headers
  })
  .then(response => console.log('response', response.data) || response.data.channel)

const getUsers = () =>
  axios.post(`${slackHost}/api/users.list`, {
    token: botOauthToken,
    limit: 100
  }, {
    headers
  })
  .then(response => response.data.members)

const resolveUsers = userIds => getUsers()
  .then(users => userIds.map(userId => users.filter(user => user.id === userId)[0]))

const resolveUser = userId => getUsers()
  .then(users => users.filter(user => user.id === userId)[0])

const sendMessage = (channel, { text, attachments = [] }) =>
  axios.post(`${slackHost}/api/chat.postMessage`, {
    channel,
    text,
    attachments
  }, {
    headers
  })

const postResponse = (responseUrl, { replace = false, text = '', attachments }) =>
  axios.post(responseUrl, {
    replace_original: replace,
    resopnse_type: 'in_channel',
    text,
    attachments
  }, {
    headers
  })

module.exports = {
  getUsers,
  getChannelInfo,
  resolveUser,
  resolveUsers,
  sendMessage,
  postResponse
}
