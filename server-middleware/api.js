const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const axios = require('axios').default
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const SERVER_BASE_URL = 'http://localhost:3000/api'
const USER_BASE_DIR = './user/'

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

app.get('/userinfo', (req, res) => {
  // get userinfo from the session or creates a new one
  let userid = req.session.userid
  if(! userid) {
    userid = getNewUserId()
    req.session.userid = userid
  }
  const userinfo = buildUserinfoFromId(userid)
  return res.json(userinfo)
})

const buildUserinfoFromId = function (userId) {
  const userBaseUrl = SERVER_BASE_URL + '/user/' + userId
  return {
    id: userId,
    keyid: userBaseUrl + '/key',
    controller: userBaseUrl,
    selfdescription: userBaseUrl + '/selfdescription'
  }
}

const getNewUserId = function() {
  const id = crypto.randomBytes(5).toString('hex');
  const userdir = path.join(USER_BASE_DIR, id)
  if(fs.existsSync(userdir)) {
    return getNewUserId() // recursively try to find a non-existing userid
  }
  fs.mkdirSync(userdir, { recursive: true })
  return id
}

const initServer = function () {
  console.log('server started.')
}

initServer()

module.exports = app
