const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('routes/slack', () => {
  let routes
  let eventHandler
  let componentHandler

  beforeEach(() => {
    eventHandler = sinon.stub().resolves()
    componentHandler = sinon.stub().resolves()

    routes = proxyquire('../../../lib/routes/slack', {
      '../slack/eventHandler': eventHandler,
      '../slack/componentHandler': componentHandler
    })
  })

  describe('#event', () => {
    let req
    let res
    beforeEach(() => {
      req = {
        body: {
          event: {}
        }
      }
      res = {}
      res.status = sinon.stub().returns(res)
      res.send = sinon.stub()
      res.sendStatus = sinon.stub()
    })

    it('returns challenge for url_verification', () => {
      const challenge = 'a challenge string'
      req.body.type = 'url_verification'
      req.body.challenge = challenge
      routes.event(req, res)
      expect(res.status).to.have.been.calledWith(200)
      expect(res.send).to.have.been.calledWith(challenge)
    })

    it('calls event handler and returns status 200', () => {
      return routes.event(req, res)
        .then(_ => {
          expect(eventHandler).to.have.been.calledWith(req.body.event)
          expect(res.sendStatus).to.have.been.calledWith(200)
        })
    })
  })

  describe('#component', () => {
    let req
    let res
    let payload
    beforeEach(() => {
      payload = {}
      req = {
        body: {
          payload: JSON.stringify(payload)
        }
      }
      res = {}
      res.status = sinon.stub().returns(res)
      res.send = sinon.stub()
    })

    it('calls component handler and returns 200', () => {
      return routes.component(req, res)
        .then(_ => {
          expect(componentHandler).to.have.been.calledWith(payload)
          expect(res.status).to.have.been.calledWith(200)
        })
    })
  })
})
