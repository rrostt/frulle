const breakfastDone = require('../slack/actions/breakfastDone')
const lists = require('../lists')

module.exports.handler = (event, context, callback) => {
  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => breakfastDone({ channel }))))
    .catch(error => console.error('something went wrong', error))
    .then(_ => {
      callback(null, { message: 'all good' })
    })
}
