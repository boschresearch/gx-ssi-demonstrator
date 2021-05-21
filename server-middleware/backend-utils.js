/*
 Copyright (c) 2021 - for information on the respective copyright owner
 see the NOTICE file and/or the repository at
 https://github.com/boschresearch/gx-ssi-demonstrator

 SPDX-License-Identifier: Apache-2.0
*/

const crypto = require('crypto')
const url = require('url')
const fs = require('fs')
const path = require('path')

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:3000/api'
const USER_BASE_DIR = './user/'
const PUB_KEY_FILENAME = 'pubKey.json'
const DID_WEB_DOC_FILENAME = 'didweb_did_doc.json'
const SELF_DESCRIPTION_FILENAME = 'selfdescription.json'

const buildUserinfoFromId = function (userId) {
  const userBaseUrl = buildUserUrl(userId)
  return {
    id: userId,
    keyid: userBaseUrl + '/key',
    controller: userBaseUrl,
    did: buildDidWebFromUrl(userBaseUrl),
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

const buildDidWebFromUrl = function (userUrl) {
  const myurl = new url.URL(userUrl)
  if (myurl.port && ((myurl.port !== 80) || (myurl.port !== 443))) {
    console.error('did:web does not support port numbers. userUrl: ', userUrl)
    return ''
  }
  let didweb = 'did:web:' + myurl.hostname
  if (myurl.pathname) {
    didweb = didweb + myurl.pathname.replace(/\//g, ':')
  }
  return didweb
}
const buildDidWebFromId = function (userId) {
  const userUrl = buildUserUrl(userId)
  return buildDidWebFromUrl(userUrl)
}

const buildUserUrl = function (userId) {
  return SERVER_BASE_URL + '/user/' + userId
}

module.exports = {
  SERVER_BASE_URL,
  USER_BASE_DIR,
  PUB_KEY_FILENAME,
  DID_WEB_DOC_FILENAME,
  SELF_DESCRIPTION_FILENAME,
  buildDidWebFromId,
  buildDidWebFromUrl,
  buildUserUrl,
  buildUserinfoFromId,
  getNewUserId
}
