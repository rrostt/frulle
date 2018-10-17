const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const sinon = require('sinon')

const axios = require('axios')

chai.use(chaiHttp)
chai.use(sinonChai)

process.env = {
  ...process.env,
  IS_OFFLINE: true,
  DYNAMODB_LISTS_TABLE: 'frulle-lists-integration',
  SLACK_BOT_OAUTH_TOKEN: ''
}

let app

function apiMock (method, url, response) {
  return axios.post('https://mockserver.rost.me/_mock', {
    baseUrl: url,
    response,
    method
  })
}

function apiCall (url) {
  return axios.get('https://mockserver.rost.me/_call', {
    params: { url }
  })
  .then(response => response.data)
}

before(() => {
  return Promise.all([
    apiMock('GET', '/api/channels.info', {
      channel: {
        members: [ 'abc', 'def' ]
      }
    }),
    apiMock('POST', '/api/chat.postMessage', {
    }),
    apiMock('POST', '/response_url', {
    }),
    apiMock('POST', '/api/users.list', {
      members: [
        {
          id: 'abc',
          real_name: 'Abc'
        },
        {
          id: 'def',
          real_name: 'Def'
        }
      ]
    })
  ])
  .then(_ => {
    app = require('../../lib/app')
  })
})

after(() => {
})

describe('the application', () => {
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
          channel: 'channel' + (Math.random() * 10000),
          user: 'user'
        }
      })
      .then(response => {
        expect(response).to.have.status(200)
        return apiCall('/api/chat.postMessage')
          .then(calls => {
            expect(calls[0].body.attachments[0].callback_id).to.be.eql('create_list')
          })
      })
  })

  describe('create list', () => {
    it('creates list with members in channel', () => {
      const response_url = 'https://mockserver.rost.me/response_url'

      // slackAdapter.getChannelInfo.resolves({
      //   members: ['abc', 'def']
      // })
      // slackAdapter.resolveUsers.resolves([
      //   {
      //     id: 'abc',
      //     real_name: 'Abc'
      //   },
      //   {
      //     id: 'def',
      //     real_name: 'Def'
      //   }
      // ])

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
          return apiCall('/response_url')
            .then(calls => {
              expect(calls[0].body.attachments[0].text).to.be.eql('Listan: Abc, Def')
            })
          // expect(slackAdapter.postResponse).to.have.been.called
          // expect(slackAdapter.postResponse).to.have.been.calledWith(response_url)
          // const msg = slackAdapter.postResponse.getCall(0).args[1]
          // expect(msg.attachments[0].text).to.be.eql('Listan: Abc, Def')
        })
    })
  })
})
