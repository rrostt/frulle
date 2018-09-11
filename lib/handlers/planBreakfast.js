const lists = require('../lists')
const { whoIsNext } = require('../slack/actions')

module.exports.handler = (event, context, callback) => {
  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => whoIsNext({ channel }))))
    .catch(error => console.error('something went wrong', error))
    .then(_ => callback(null, { message: 'all good' }))
}
