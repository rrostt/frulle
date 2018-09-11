module.exports = (member, channel, text = undefined) => ({
  text: text || `Nästa person på listan är är <@${member.userId}>`,
  replace: true,
  attachments: [{
    text: 'Kan hen ta hand om frukosten?',
    callback_id: 'agree_to_chore',
    color: '#0f0',
    attachment_type: 'default',
    actions: [
      {
        name: 'answer',
        text: 'Japp!',
        type: 'button',
        value: JSON.stringify({
          agreed: true,
          user: member.userId,
          channel: channel,
          position: member.position
        })
      },
      {
        name: 'answer',
        text: 'Nej',
        type: 'button',
        value: JSON.stringify({
          agreed: false,
          user: member.userId,
          channel: channel,
          position: member.position
        })
      }
    ]
  }]
})
