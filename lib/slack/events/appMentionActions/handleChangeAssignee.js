const lists = require('../../../lists')
const planBreakfast = require('../../actions/planBreakfast')

const handleChangeAssignee = event =>
  lists.unassignMember(event.channel)
    .then(_ => planBreakfast(event))

module.exports = handleChangeAssignee
