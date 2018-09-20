const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/event/appMentionActions/removeUser', () => {
  let handleRemoveUser
  let slackAdapter
  let getMentions
  let event

  beforeEach(() => {
    event = {
      text: 'ta bort',
      channel: 'channel',
      user: 'user'
    }
    slackAdapter = {
      resolveUser: sinon.stub().resolves(),
      sendMessage: sinon.stub().resolves()
    }
    getMentions = sinon.stub().resolves([])

    handleRemoveUser = proxyquire('../../../../../lib/slack/events/appMentionActions/handleRemoveUser', {
      '../../slackAdapter': slackAdapter,
      '../../utils/getMentions': getMentions
    })
  })

  it('chooses self if no user in mention', () => {
    slackAdapter.resolveUser.resolves({ name: 'name', id: 'id' })
    return handleRemoveUser(event)
      .then(_ => {
        const msg = slackAdapter.sendMessage.getCall(0).args[1]
        expect(msg.text).to.be.eql('Ska jag ta bort name')
        expect(msg.attachments[0].actions[0].value).to.be.eql(
          JSON.stringify({
            user: 'id',
            channel: 'channel'
          })
        )
      })
  })

  it('chooses user mentioned', () => {
    slackAdapter.resolveUser.resolves({ name: 'not picked name', id: 'id' })
    getMentions.resolves([{ name: 'picked name', id: 'picked id' }])
    return handleRemoveUser(event)
      .then(_ => {
        const msg = slackAdapter.sendMessage.getCall(0).args[1]
        expect(msg.text).to.be.eql('Ska jag ta bort picked name')
        expect(msg.attachments[0].actions[0].value).to.be.eql(
          JSON.stringify({
            user: 'picked id',
            channel: 'channel'
          })
        )
      })
  })
})
