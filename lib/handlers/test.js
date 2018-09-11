const lists = require('../adapters/dynamodbLists')

module.exports.handler = (event, context, callback) => {
  lists.getList('C734TAXPW')
    .then(list => {
      console.log('got list', list)
      return list
    })
    .catch(error => console.log('something went wrong', error))
    .then(list => {
      callback(null, { message: 'all good', list })
    })
}
