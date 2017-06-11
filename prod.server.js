var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port
console.log(port)
var app = express()

var router = express.Router()

router.get('/', function (req, res, next) {
  req.url = '/index.html'
  next()
})

app.use(router)

var appData = require('./data.json')
var application = appData.application

var apiRouter = express.Router()
apiRouter.get('/application', function (req, res) {
  res.json({
    data: application
  })
})
app.use('/api', apiRouter)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
