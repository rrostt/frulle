const proxyquire = require('proxyquire')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

describe('slack/events/appMention', () => {
  let appMention
  let lists
  let slackAdapter
  let planBreakfast
  let breakfastDone
  let handleChangeAssignee,
    handleWhoFixedBreakfast,
    handleAddUser,
    handleRemoveUser,
    handleShowList,
    handleHelp,
    handleCancelled
  let event

  beforeEach(() => {
    event = {
      channel: 'channel',
      user: 'user'
    }
    lists = {
      hasList: sinon.stub().resolves(true)
    }
    slackAdapter = {
      sendMessage: sinon.stub().resolves()
    }
    planBreakfast = sinon.stub().resolves()
    breakfastDone = sinon.stub().resolves()
    handleChangeAssignee = sinon.stub().resolves()
    handleWhoFixedBreakfast = sinon.stub().resolves()
    handleAddUser = sinon.stub().resolves()
    handleRemoveUser = sinon.stub().resolves()
    handleShowList = sinon.stub().resolves()
    handleHelp = sinon.stub().resolves()
    handleCancelled = sinon.stub().resolves()

    appMention = proxyquire('../../../../lib/slack/events/appMention', {
      '../../lists': lists,
      '../../slack/slackAdapter': slackAdapter,
      '../actions/planBreakfast': planBreakfast,
      '../actions/breakfastDone': breakfastDone,
      './appMentionActions/handleChangeAssignee': handleChangeAssignee,
      './appMentionActions/handleWhoFixedBreakfast': handleWhoFixedBreakfast,
      './appMentionActions/handleAddUser': handleAddUser,
      './appMentionActions/handleRemoveUser': handleRemoveUser,
      './appMentionActions/handleShowList': handleShowList,
      './appMentionActions/handleHelp': handleHelp,
      './appMentionActions/handleCancelled': handleCancelled
    })
  })

  it('asks about starting a list when there is no list', () => {
    lists.hasList.resolves(false)
    return appMention(event)
      .then(_ => {
        expect(slackAdapter.sendMessage).to.be.calledWith(event.channel)
        const msg = slackAdapter.sendMessage.getCall(0).args[1]
        expect(msg.text).to.be.eql('Hej, vill du att jag startar en frukostlista?')
      })
  })

  it('handles remove user', () => {
    event.text = 'hej frulle ta bort mig'
    return appMention(event)
      .then(_ => {
        expect(handleRemoveUser).to.be.calledWith(event)
      })
  })

  it('handles add user', () => {
    event.text = 'hej frulle lägg till mig'
    return appMention(event)
      .then(_ => {
        expect(handleAddUser).to.be.calledWith(event)
      })
  })

  it('handles who is up', () => {
    event.text = 'hej frulle vems tur är det?'
    return appMention(event)
      .then(_ => {
        expect(planBreakfast).to.be.calledWith(event)
      })
  })

  it('handles klar', () => {
    event.text = 'hej frulle frukosten är klar'
    return appMention(event)
      .then(_ => {
        expect(breakfastDone).to.be.calledWith(event)
      })
  })

  it('handles setting who fixed breakfast', () => {
    event.text = 'hej frulle <@abcde> fixade frukost'
    return appMention(event)
      .then(_ => {
        expect(handleWhoFixedBreakfast).to.be.calledWith(event)
      })
  })

  it('handles changing who is up for fixing breakfast', () => {
    event.text = 'hej frulle ändra'
    return appMention(event)
      .then(_ => {
        expect(handleChangeAssignee).to.be.calledWith(event)
      })
  })

  it('handles listing the list', () => {
    event.text = 'hej frulle visa listan'
    return appMention(event)
      .then(_ => {
        expect(handleShowList).to.be.calledWith(event)
      })
  })

  it('handles help', () => {
    event.text = 'help'
    return appMention(event)
      .then(_ => {
        expect(handleHelp).to.be.calledWith(event)
      })
  })

  it('handles inställd', () => {
    event.text = 'inställd'
    return appMention(event)
      .then(_ => {
        expect(handleCancelled).to.be.calledWith(event)
      })
  })
})
