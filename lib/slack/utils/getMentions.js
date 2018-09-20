const { resolveUsers } = require('../slackAdapter')

const getMentions = text => {
  const regexp = /<@([^>]*?)>/gi
  const find = () => {
    const result = regexp.exec(text)
    if (!result) { return [] } else { return [result[1]].concat(find()) }
  }
  return resolveUsers(find())
    .then(users => users.filter(({ is_bot: isBot }) => !isBot))
}

module.exports = getMentions
