const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/event route handler', () => {
  let route
  let req
  let res
  let send
  let challenge
  let message
  let appMention
  let memberJoinedChannel
  let memberLeftChannel
  let eventActions

  beforeEach(() => {
    challenge = 'a challenge'
    send = sinon.stub()
    req = {
      body: {
        challenge,
        type: 'type',
        event: {}
      }
    }
    res = {
      status: sinon.stub().returns({
        send
      }),
      sendStatus: sinon.stub()
    }
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
    route = proxyquire('../../../lib/slack/event', {
      './events/message': message,
      './events/appMention': appMention,
      './events/memberJoinedChannel': memberJoinedChannel,
      './events/memberLeftChannel': memberLeftChannel
    })
  })

  it('sends challenge on url_verification', () => {
    req.body.type = 'url_verification'
    route(req, res)
    expect(send).to.have.been.calledWith(challenge)
  })

  describe('eventActions', () => {
    it(`calls correct handler on event type`, () => {
      eventActions.map(({ type, action }) => {
        req.body.event.type = type
        return route(req, res)
          .then(_ => {
            expect(action).to.have.been.called
            expect(res.sendStatus).to.have.been.calledWith(200)
          })
      })
    })
  })
})
