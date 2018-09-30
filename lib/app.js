var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const slackRoutes = require('./routes/slack')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/component', slackRoutes.component)
app.post('/slack/event', slackRoutes.event)

app.get('/actions/breakfastDone', require('./routes/breakfastDone'))
app.get('/actions/planBreakfast', require('./routes/planBreakfast'))

app.get('/web/list/:channel', require('./routes/list/get'))
app.post('/web/list/:channel', require('./routes/list/post'))

module.exports = app
