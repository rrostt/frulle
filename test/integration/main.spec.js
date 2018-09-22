const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const sinon = require('sinon')

chai.use(chaiHttp)
chai.use(sinonChai)

process.env = {
  ...process.env,
  IS_OFFLINE: true,
  DYNAMODB_LISTS_TABLE: 'frulle-lists-integration',
  SLACK_BOT_OAUTH_TOKEN: ''
}

let app
const slackAdapter = require('../../lib/slack/slackAdapter')

before(() => {
  slackAdapter.sendMessage = sinon.stub().resolves()
  slackAdapter.postResponse = sinon.stub().resolves()
  slackAdapter.getChannelInfo = sinon.stub().resolves({})
  slackAdapter.resolveUsers = sinon.stub().resolves([])

  app = require('../../lib/app')
})

after(() => {
})

describe.only('the application', () => {
  it('handles url_verification events', () => {
    const challenge = 'asdf'
    return chai.request(app)
      .post('/slack/event')
      .send({
        challenge,
        type: 'url_verification',
        event: {}
      })
      .then(response => {
        expect(response).to.have.status(200)
        expect(response.text).to.eql(challenge)
      })
  })

  it('handles app_mention when no list', () => {
    return chai.request(app)
      .post('/slack/event')
      .send({
        type: 'app_mention',
        event: {
          type: 'app_mention',
          text: '<@123>',
          channel: 'channel',
          user: 'user'
        }
      })
      .then(response => {
        expect(response).to.have.status(200)
        expect(slackAdapter.sendMessage).to.have.been.called
        expect(slackAdapter.sendMessage).to.have.been.calledWith('channel')
      })
  })

  describe('app_mention', () => {
    it('creates list with members in channel', () => {
      const response_url = 'response_url'

      slackAdapter.getChannelInfo.resolves({
        members: ['abc', 'def']
      })
      slackAdapter.resolveUsers.resolves([{
        id: 'abc',
        real_name: 'Abc'
      },
      {
        id: 'def',
        real_name: 'Def'
      }])
      return chai.request(app)
        .post('/slack/component')
        .send({
          payload: JSON.stringify({
            callback_id: 'create_list',
            channel: { id: 'channel' },
            actions: [ { value: 'yes' } ],
            response_url
          })
        })
        .then(response => {
          expect(response).to.have.status(200)
          expect(slackAdapter.postResponse).to.have.been.called
          expect(slackAdapter.postResponse).to.have.been.calledWith(response_url)
          const msg = slackAdapter.postResponse.getCall(0).args[1]
          expect(msg.attachments[0].text).to.be.eql('Listan: Abc, Def')
        })
    })
  })
})
