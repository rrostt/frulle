const createList = require('./callbacks/createList')
const removeUser = require('./callbacks/removeUser')
const agreeToChore = require('./callbacks/agreeToChore')
const verifyDidChore = require('./callbacks/verifyDidChore')

const callbacks = {
  'create_list': createList,
  'remove_user': removeUser,
  'agree_to_chore': agreeToChore,
  'verify_did_chore': verifyDidChore
}

module.exports = (req, res) => {
  const payload = JSON.parse(req.body.payload)
  console.log('payload', payload)

  const callback = callbacks[payload.callback_id]
  if (callback) {
    callback(payload)
      .then(_ => {
        res.status(200).send('')
      })
  }
}
