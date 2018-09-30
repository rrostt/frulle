const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/event handler', () => {
  let handler
  let message
  let appMention
  let memberJoinedChannel
  let memberLeftChannel
  let eventActions

  beforeEach(() => {
    message = sinon.stub().resolves()
    appMention = sinon.stub().resolves()
    memberJoinedChannel = sinon.stub().resolves()
    memberLeftChannel = sinon.stub().resolves()
    eventActions = [
      {
        type: 'message', action: message
      },
      {
        type: 'app_mention', action: appMention
      },
      {
        type: 'member_joined_channel', action: memberJoinedChannel
      },
      {
        type: 'member_left_channel', action: memberLeftChannel
      }
    ]
    handler = proxyquire('../../../lib/slack/eventHandler', {
      './events/message': message,
      './events/appMention': appMention,
      './events/memberJoinedChannel': memberJoinedChannel,
      './events/memberLeftChannel': memberLeftChannel
    })
  })

  describe('eventActions', () => {
    it(`calls correct handler on event type`, () => {
      eventActions.map(({ type, action }) => {
        const event = { type }
        return handler(event)
          .then(_ => {
            expect(action).to.have.been.calledWith(event)
          })
      })
    })
  })
})
