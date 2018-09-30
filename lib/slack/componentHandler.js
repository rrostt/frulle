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

module.exports = payload => {
  const callback = callbacks[payload.callback_id]
  if (callback) {
    return callback(payload)
  } else {
    return Promise.reject(new Error('no such callback'))
  }
}
