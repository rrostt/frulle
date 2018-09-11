module.exports = listMembers => ({
  title: 'De här är nu med i listan',
  fields: listMembers.map(member => ({
    title: member.name,
    short: true
  }))
})
