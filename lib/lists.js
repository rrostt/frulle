const { getLists, getList, setList, hasList } = require('./adapters/dynamodbLists')

const sortByPosition = (a, b) => a.position - b.position

const getTopChannelPosition = members =>
  members
    .reduce(
      (topPosition, member) => Math.max(topPosition, member.position),
      0
    )

const getChannels = getLists

const createList = (channel, members) =>
  Promise.resolve()
    .then(_ => {
      const listMembers = members.map((user, i) => ({
        position: i,
        userId: user.id,
        name: user.name
      }))

      console.log('created channel list', listMembers)

      return setList(channel, { members: listMembers })
    })
    .then(({ members }) => members.sort(sortByPosition))

const isMemberInList = (user, channel) =>
  getList(channel)
    .then(({ members }) => members.some(member => member.userId === user))
    .catch(_ => false)

const addMemberToList = (user, channel) =>
  getList(channel)
    .then(list => setList(channel, {
      ...list,
      members: [...list.members, {
        position: getTopChannelPosition(list.members) + 1,
        userId: user.id,
        name: user.name
      }]
    }))
    .then(({ members }) => members.sort(sortByPosition))

const removeMemberFromList = (userId, channel) =>
  getList(channel)
    .then(list =>
      setList(channel, {
        ...list,
        members: list.members.filter(member => member.userId !== userId)
      })
    )
    .then(({ members }) => members.sort(sortByPosition))
    .catch(_ => { throw new Error('Kanalen har ingen lista') })

const getNextInList = (channel, afterPosition) =>
  getList(channel)
    .then(({ members }) =>
      members.filter(({ position }) => position > afterPosition).sort(sortByPosition)[0]
    )

const setMemberLastInList = (user, channel) =>
  getList(channel)
    .then(list =>
      setList(channel, {
        ...list,
        members: list.members
          .map(member => member.userId === user
            ? {
              ...member,
              position: getTopChannelPosition(list.members) + 1
            } : member
          )
      })
    )
    .then(({ members }) => members.sort(sortByPosition))

const assignMember = (userId, channel) =>
  getList(channel)
    .then(list =>
      setList(channel, {
        ...list,
        assignee: userId
      })
    )
    .then(_ => userId)

const getAssignedMember = channel =>
  getList(channel)
    .then(({ assignee }) => assignee)

const unassignMember = channel =>
  getList(channel)
    .then(list =>
      setList(channel, {
        ...list,
        assignee: undefined
      })
    )

module.exports = {
  getChannels,
  hasList,
  createList,
  isMemberInList,
  addMemberToList,
  removeMemberFromList,
  getNextInList,
  setMemberLastInList,
  assignMember,
  getAssignedMember,
  unassignMember
}
