const { sendMessage } = require('../../slackAdapter')

const handleHelp = event =>
  sendMessage(event.channel, {
    text: 'Hej, det är jag som är frulle. Jag håller koll på frukostlistan. Det bästa sättet att ta reda på vad jag kan är att kolla koden på github. Där kan du även submitta PRs så att jag kan göra mer! Du hittar den här: https://github.com/rrostt/frulle'
  })

module.exports = handleHelp
