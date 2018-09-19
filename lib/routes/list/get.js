const lists = require('../../lists')
const { getChannelInfo } = require('../../slack/slackAdapter')

const stripPosition = ({ position, ...member }) => member

module.exports = (req, res) => {
  const { channel } = req.params

  Promise.all([lists.getMembers(channel), getChannelInfo(channel)])
    .then(([members, channelInfo]) => {
      res.send(`
      <html>
        <body>
          Channel: ${channelInfo.name}<br />
          <form method='post'>
            <textarea name='membersJson'>${JSON.stringify(members.map(stripPosition), null, 2)}</textarea>
            <br />
            <input type='submit' value='submit' />
          </form>
        </body>
      </html>
      `)
    })
}
