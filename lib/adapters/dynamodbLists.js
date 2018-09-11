const dynamodb = require('./dynamodb')

const getList = channelId => new Promise((resolve, reject) => {
  const params = {
    TableName: process.env.DYNAMODB_LISTS_TABLE,
    Key: {
      channel: channelId
    }
  }

  dynamodb.get(params, (error, result) => {
    if (error) {
      console.error(error)
      reject(error)
    }

    resolve(result.Item)
  }).send()
})

const setList = (channelId, list) => new Promise((resolve, reject) => {
  const params = {
    TableName: process.env.DYNAMODB_LISTS_TABLE,
    Item: {
      channel: channelId,
      ...list
    }
  }
  dynamodb.put(params, (error) => {
    if (error) {
      reject(error)
      return
    }
    resolve(params.Item)
  }).send()
})

const hasList = channelId =>
  getList(channelId)
    .then(list => !!list)
    .catch(_ => false)

const getLists = () => new Promise((resolve, reject) => {
  console.log('dynamodbLists getLists')
  const params = {
    TableName: process.env.DYNAMODB_LISTS_TABLE
  }

  dynamodb.scan(params, (error, result) => {
    console.log('scan complete')
    if (error) {
      reject(error)
      return
    }

    resolve(result.Items.map(({ channel }) => channel))
  }).send((_, data) => { console.log('sending the scan') })
})

module.exports = {
  hasList,
  getList,
  setList,
  getLists
}
