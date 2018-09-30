const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/component handler', () => {
  let handler
  let createList
  let removeUser
  let agreeToChore
  let verifyDidChore
  let eventActions

  beforeEach(() => {
    createList = sinon.stub().resolves()
    removeUser = sinon.stub().resolves()
    agreeToChore = sinon.stub().resolves()
    verifyDidChore = sinon.stub().resolves()
    eventActions = [
      {
        type: 'create_list', action: createList
      },
      {
        type: 'remove_user', action: removeUser
      },
      {
        type: 'agree_to_chore', action: agreeToChore
      },
      {
        type: 'verify_did_chore', action: verifyDidChore
      }
    ]
    handler = proxyquire('../../../lib/slack/componentHandler', {
      './callbacks/createList': createList,
      './callbacks/removeUser': removeUser,
      './callbacks/agreeToChore': agreeToChore,
      './callbacks/verifyDidChore': verifyDidChore
    })
  })

  describe('eventActions', () => {
    it(`calls correct handler on event type`, () => {
      eventActions.map(({ type, action }) => {
        const payload = { callback_id: type }
        return handler(payload)
          .then(_ => {
            expect(action).to.have.been.calledWith(payload)
          })
      })
    })

    it('rejects if no callback exist', () => {
      return handler({ callback_id: 'no such type' })
        .then(_ => {
          expect(false).to.be.eql(true)
        })
        .catch(error => {
          expect(error.message).to.be.eql('no such callback')
        })
    })
  })
})
