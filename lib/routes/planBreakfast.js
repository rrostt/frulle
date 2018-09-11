const lists = require('../lists')
const { whoIsNext } = require('../slack/actions')

module.exports = (req, res) => {
  res.status(200).send()

  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => whoIsNext({ channel }))))
    .catch(error => console.error('something went wrong', error))
}
