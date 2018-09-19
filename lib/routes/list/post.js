const lists = require('../../lists')

const sortByUserId = (a, b) => a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0
const stripPosition = ({ position, ...member }) => member

module.exports = (req, res) => {
  const { channel } = req.params
  const { membersJson } = req.body

  const members = JSON.parse(membersJson)

  lists.getMembers(channel)
    .then(currentMembers => {
      const sortedMembers = [...members].sort(sortByUserId)
      const sortedCurrentMembers = currentMembers.map(stripPosition).sort(sortByUserId)

      const unaltered = sortedMembers.reduce((unaltered, member, i) => unaltered && JSON.stringify(member) === JSON.stringify(sortedCurrentMembers[i]), true)

      return unaltered
    })
    .then(unaltered => {
      if (unaltered) {
        lists.setMembers(channel, members.map((member, i) => ({ ...member, position: i + 1 })))
          .then(_ => {
            res.send('awesome... it\'s been noted... moahahah')
          })
      } else {
        res.send('you can only change the order of the array ffs')
      }
    })
}
