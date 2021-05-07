const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const axios = require('axios').default
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const SERVER_BASE_URL = 'http://localhost:3000/api'
const USER_BASE_DIR = './user/'
const PUB_KEY_FILENAME = 'pubKey.json'

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

app.get('/user/:userid', (req, res) => {
  // to fetch the "controller"
  const userid = req.params.userid
  const userinfo = buildUserinfoFromId(userid)
  result = {
    // '@context': 'https://w3id.org/security/v2', // TODO: do we need this here?
    id: userinfo.controller,
    authentication: [
      userinfo.keyid
    ],
    assertionMethod: [
      userinfo.keyid
    ]
  }
  return res.json(result)
})
app.post('/user/key', (req, res) => {
  // update the public key for the user of this session
  const userid = req.session.userid
  if (!userid) {
    return res.status(404).json({ error: 'You need to fetch / generate a userinfo first. (No userid in your session yet)' })
  }
  const { id, controller, publicKeyBase58, type } = req.body
  const userinfo = buildUserinfoFromId(userid)
  // check if uer is allowed to update
  if (id !== userinfo.keyid) {
    return res.status(404).json({ error: 'Key ID does not match userinfo' })
  }
  if (controller !== userinfo.controller) {
    return res.status(404).json({ error: 'Controller does not match userinfo' })
  }
  // additional fields are not checked, which means those are allowd for now
  const newKeyObj = req.body
  const pubKeyFile = path.join(USER_BASE_DIR, userid, PUB_KEY_FILENAME)
  fs.writeFileSync(pubKeyFile, JSON.stringify(newKeyObj, null, 4))
  res.json({})
})
app.get('/user/:userid/key', (req, res) => {
  // fetch the public key for the user
  const userid = req.params.userid
  const keyFilePath = path.join(USER_BASE_DIR, userid, PUB_KEY_FILENAME)
  if(!fs.existsSync(keyFilePath)) {
    return res.status(400).json({ error: 'User or key file for user does not exist' })
  }
  const pubKey = JSON.parse(fs.readFileSync(keyFilePath))
  return res.json(pubKey)
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
