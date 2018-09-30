const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/slackAdapter', () => {
  let slackAdapter
  let axios
  const token = 'abcd'
  beforeEach(() => {
    axios = {
      get: sinon.stub().resolves({ data: {} }),
      post: sinon.stub().resolves({ data: {} })
    }
    process.env.SLACK_BOT_OAUTH_TOKEN = token
    slackAdapter = proxyquire('../../../lib/slack/slackAdapter', {
      'axios': axios
    })
  })

  describe('#getChannelInfo', () => {
    it('uses route channels.info', () => {
      const url = 'https://slack.com/api/channels.info'
      const channel = 'channel'

      return slackAdapter.getChannelInfo(channel)
        .then(_ => {
          expect(axios.get).to.have.been.calledWith(url)
        })
    })
  })

  describe('#getUsers', () => {
    it('uses route users.list', () => {
      const url = 'https://slack.com/api/users.list'
      const channel = 'channel'

      return slackAdapter.getUsers(channel)
        .then(_ => {
          expect(axios.post).to.have.been.calledWith(url)
        })
    })
  })

  describe('#resolveUsers', () => {
    it('returnes matching users', () => {
      const userIds = [1, 2]
      const members = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
      const expected = [
        { id: 1 },
        { id: 2 }
      ]
      axios.post.resolves({data: { members: members }})
      return slackAdapter.resolveUsers(userIds)
        .then(users => {
          expect(users).to.be.eql(expected)
        })
    })
  })

  describe('#resolveUser', () => {
    it('returnes matching user', () => {
      const userId = 1
      const members = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
      const expected = { id: 1 }
      axios.post.resolves({data: { members: members }})
      return slackAdapter.resolveUser(userId)
        .then(user => {
          expect(user).to.be.eql(expected)
        })
    })
  })

  describe('#sendMessage', () => {
    it('posts to correct url', () => {
      const url = 'https://slack.com/api/chat.postMessage'
      const channel = 'channel'

      return slackAdapter.sendMessage(channel, { text: 'hej' })
        .then(_ => {
          expect(axios.post).to.have.been.calledWith(url)
        })
    })
  })
})
