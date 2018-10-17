const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/events/channelLeft', () => {
  let channelLeft
  let lists
  let slackAdapter
  let event

  beforeEach(() => {
    event = {
      channel: 'channel',
      user: 'user'
    }
    lists = {
      hasList: sinon.stub().resolves(true),
      deleteList: sinon.stub().resolves()
    }
    slackAdapter = {
      sendMessage: sinon.stub().resolves()
    }

    channelLeft = proxyquire('../../../../lib/slack/events/channelLeft', {
      '../../lists': lists,
      '../../slack/slackAdapter': slackAdapter
    })
  })

  it('deletes list if exists', () => {
    lists.hasList.resolves(true)
    return channelLeft(event)
      .then(_ => {
        expect(lists.deleteList).to.be.calledWith(event.channel)
        expect(slackAdapter.sendMessage).to.be.calledWith(event.channel)
      })
  })

  it('does not delete list if list does not exists', () => {
    lists.hasList.resolves(false)
    return channelLeft(event)
      .then(_ => {
        expect(lists.deleteList).to.not.be.calledWith(event.channel)
      })
  })
})
