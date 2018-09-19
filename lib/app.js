var express = require('express')
var app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/component', require('./slack/component'))

app.post('/slack/event', require('./slack/event'))

app.get('/actions/breakfastDone', require('./routes/breakfastDone'))
app.get('/actions/planBreakfast', require('./routes/planBreakfast'))

app.get('/web/list/:channel', require('./routes/list/get'))
app.post('/web/list/:channel', require('./routes/list/post'))

module.exports = app
