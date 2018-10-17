const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/event/appMentionActions/handleCancelled', () => {
  let handleCancelled
  let slackAdapter
  let event

  beforeEach(() => {
    event = {
      text: 'inställd',
      channel: 'channel',
      user: 'user'
    }
    slackAdapter = {
      sendMessage: sinon.stub().resolves()
    }

    handleCancelled = proxyquire('../../../../../lib/slack/events/appMentionActions/handleCancelled', {
      '../../slackAdapter': slackAdapter
    })
  })

  it('acknowledges that is has been cancelled', () => {
    return handleCancelled(event)
      .then(_ => {
        const msg = slackAdapter.sendMessage.getCall(0).args[1]
        expect(msg.text).to.be.eql('Ok! Det är noterat att frukosten är inställd. Men kom ihåg att frulle är det viktigaste målet på dagen :cheese_wedge:')
      })
  })
})
