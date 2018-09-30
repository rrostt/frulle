const eventHandler = require('../slack/eventHandler')
const componentHandler = require('../slack/componentHandler')

const event = (req, res) => {
  const { challenge, type, event } = req.body

  if (type === 'url_verification') {
    res.status(200).send(challenge)
  } else {
    return eventHandler(event)
      .catch(error => console.error(error.message))
      .then(_ => {
        res.sendStatus(200)
      })
  }
}

const component = (req, res) => {
  const payload = JSON.parse(req.body.payload)

  return componentHandler(payload)
    .catch(error => console.error(error.message))
    .then(_ => {
      res.status(200).send('')
    })
}

module.exports = {
  event,
  component
}
