/*
 Copyright (c) 2021 - for information on the respective copyright owner
 see the NOTICE file and/or the repository at
 https://github.com/boschresearch/gx-ssi-demonstrator

 SPDX-License-Identifier: Apache-2.0
*/

const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const axios = require('axios').default
const fs = require('fs')
const path = require('path')

const utils = require('./backend-utils')
const didutils = require('./did')

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
    userid = utils.getNewUserId()
    req.session.userid = userid
  }
  const userinfo = utils.buildUserinfoFromId(userid)
  return res.json(userinfo)
})

app.get('/user/:userid', (req, res) => {
  // to fetch the "controller"
  const userid = req.params.userid
  const userinfo = utils.buildUserinfoFromId(userid)
  result = {
    '@context': 'https://w3id.org/security/v2', // mandatory to get a proper verify result!
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
    return res.status(401).json({ error: 'You need to fetch / generate a userinfo first. (No userid in your session yet)' })
  }
  const { id, controller, publicKeyBase58, type } = req.body
  const userinfo = utils.buildUserinfoFromId(userid)
  // check if uer is allowed to update
  if (id !== userinfo.keyid) {
    return res.status(403).json({ error: 'Key ID does not match userinfo' })
  }
  if (controller !== userinfo.controller) {
    return res.status(403).json({ error: 'Controller does not match userinfo' })
  }
  // additional fields are not checked, which means those are allowd for now
  const newKeyObj = req.body
  const pubKeyFile = path.join(utils.USER_BASE_DIR, userid, utils.PUB_KEY_FILENAME)
  fs.writeFileSync(pubKeyFile, JSON.stringify(newKeyObj, null, 4))

  // and now the did:web document if we have a did defined
  if (userinfo.did) {
    const diddoc = didutils.buildDidDocument(userinfo.did, newKeyObj.publicKeyBase58, newKeyObj.type)
    const didwebDocFile = path.join(utils.USER_BASE_DIR, userid, utils.DID_WEB_DOC_FILENAME)
    fs.writeFileSync(didwebDocFile, JSON.stringify(diddoc, null, 4))
  }

  res.json({})
})
app.get('/user/:userid/key', (req, res) => {
  // fetch the public key for the user
  const userid = req.params.userid
  const keyFilePath = path.join(utils.USER_BASE_DIR, userid, utils.PUB_KEY_FILENAME)
  if(!fs.existsSync(keyFilePath)) {
    return res.status(404).json({ error: 'User or key file for user does not exist' })
  }
  const pubKey = JSON.parse(fs.readFileSync(keyFilePath))
  return res.json(pubKey)
})
app.get('/user/:userid/did.json', (req, res) => {
  const userid = req.params.userid
  const diddocFilePath = path.join(utils.USER_BASE_DIR, userid, utils.DID_WEB_DOC_FILENAME)
  if (!fs.existsSync(diddocFilePath)) {
    return res.status(404).json({ error: 'DID Document for the given user does not exist. userid: ' + userid })
  }
  const diddoc = JSON.parse(fs.readFileSync(diddocFilePath))
  return res.json(diddoc)
})

app.post('/user/selfdescription', (req, res) => {
  // publish the client side signed self-description
  const userid = req.session.userid
  if (!userid) {
    return res.status(401).json({ error: 'You need to fetch / generate a userinfo first. (No userid in your session yet)' })
  }
  const userinfo = utils.buildUserinfoFromId(userid)
  const sd = req.body
  // for now, a user is allowed to publish any SD they want. No futher content checks
  const sdPath = path.join(utils.USER_BASE_DIR, userid, utils.SELF_DESCRIPTION_FILENAME)
  fs.writeFileSync(sdPath, JSON.stringify(sd, null, 4))
  return res.json({ selfdescription: userinfo.selfdescription })
})
app.get('/user/:userid/selfdescription', (req, res) => {
  // fetch the publicly avilable selfdescription for the given userid
  const userid = req.params.userid
  const sdFilePath = path.join(utils.USER_BASE_DIR, userid, utils.SELF_DESCRIPTION_FILENAME)
  if(!fs.existsSync(sdFilePath)) {
    return res.status(404).json({error: 'Self-Description for the given user does not exist'})
  }
  const sd = JSON.parse(fs.readFileSync(sdFilePath))
  return res.json(sd)
})


const initServer = function () {
  console.log('server started.')
  console.log('using SERVER_BASE_URL: ', utils.SERVER_BASE_URL)
}

initServer()

module.exports = app
