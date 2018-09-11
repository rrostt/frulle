const lists = require('../lists')
const planBreakfast = require('../slack/actions/planBreakfast')

module.exports = (req, res) => {
  res.status(200).send()

  lists.getChannels()
    .then(channels => Promise.all(channels.map(channel => planBreakfast({ channel }))))
    .catch(error => console.error('something went wrong', error))
}
