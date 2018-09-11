const lists = require('../lists')
const planBreakfast = require('../slack/actions/planBreakfast')

module.exports.handler = (event, context, callback) => {
  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => planBreakfast({ channel }))))
    .catch(error => console.error('something went wrong', error))
    .then(_ => callback(null, { message: 'all good' }))
}
