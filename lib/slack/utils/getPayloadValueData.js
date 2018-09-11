const getPayloadValueData = payload => {
  const value = payload.actions[0].value
  return value ? JSON.parse(value) : {}
}

module.exports = getPayloadValueData
