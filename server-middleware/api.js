const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const axios = require('axios').default

app.use(session({
  secret: 'catalog-demo-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(bodyParser.json())

app.post('/vc', (req, res) => {
  console.log('post vc')
  return res.json({error: 'not implemented yet'})
})
app.get('/vc/:id', (req, res) => {
  // only fetch from session id storage!
  console.log('not implemented yet')
  return res.json({error: 'not implemented yet'})
})


const initServer = function () {
  console.log('server started.')
}

initServer()

module.exports = app
