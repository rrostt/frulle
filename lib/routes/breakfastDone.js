const lists = require('../lists')
const breakfastDone = require('../slack/actions/breakfastDone')

module.exports = (req, res) => {
  res.status(200).send()

  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => breakfastDone({ channel }))))
    .catch(error => console.error('something went wrong', error))
}
