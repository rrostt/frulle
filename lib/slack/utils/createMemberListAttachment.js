module.exports = listMembers => ({
  text: 'Listan: ' +
    listMembers.map(({ name }) => name).join(', ')
  // fields: listMembers.map(member => ({
  //   title: member.name,
  //   short: true
  // }))
})
