const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/utils/getMentions', () => {
  let getMentions
  let resolveUsers

  beforeEach(() => {
    resolveUsers = sinon.stub().resolves([])
    getMentions = proxyquire('../../../../lib/slack/utils/getMentions', {
      '../slackAdapter': { resolveUsers }
    })
  })

  it('finds no mentions when noone mentioned', () => {
    const text = 'hej'
    return getMentions(text)
      .then(_ => {
        expect(resolveUsers).to.be.calledWith([])
      })
  })

  it('finds one mentioned user', () => {
    const text = 'hej <@abc>'
    return getMentions(text)
      .then(_ => {
        expect(resolveUsers).to.be.calledWith(['abc'])
      })
  })

  it('finds several mentioned user', () => {
    const text = 'hej <@abc> <@cde> hej <@fdr>'
    return getMentions(text)
      .then(_ => {
        expect(resolveUsers).to.be.calledWith(['abc', 'cde', 'fdr'])
      })
  })
})
