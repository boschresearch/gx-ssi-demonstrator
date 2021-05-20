const { assert, expect } = require('chai')
const chai = require('chai')
const should = chai.should()
// const assert = chai.assert
const utils = require('../server-middleware/backend-utils')
const did = require('../server-middleware/did')

const URL_DOMAIN_PORT_USER = 'http://example.com:8080/user1'
const URL_DOMAIN_USER = 'http://example.com/user1'
const URL_DOMAIN_USER_PATH = 'http://example.com/api/something/user1'

describe('utils URL transformation to did:web', () => {
  it('should be empty string with a given port', () => {
    const didweb = utils.buildDidWebFromUrl(URL_DOMAIN_PORT_USER)
    expect(didweb).to.equal('')
  })
  it('should convert without port', () => {
    const didweb = utils.buildDidWebFromUrl(URL_DOMAIN_USER)
    expect(didweb).to.equal('did:web:example.com:user1')
  })
  it('should convert multiple path parts', () => {
    const didweb = utils.buildDidWebFromUrl(URL_DOMAIN_USER_PATH)
    expect(didweb).to.equal('did:web:example.com:api:something:user1')
  })
})
describe('did:web document', () => {
  const didweb = 'did:web:example.com'
  const pubKey = 'B34tL6WiWVL6GaYfyLXaR5sJziMHUfBjuKJfWSGSLnyz'
  const keyType = 'Ed25519VerificationKey2018'
  const diddoc = did.buildDidDocument(didweb, pubKey, keyType)
  it('should contain the publicKey section', () => {
    expect(diddoc).to.nested.include({ 'publicKey[0].controller': didweb })
    expect(diddoc).to.nested.include({ 'publicKey[0].type': keyType })
    expect(diddoc).to.nested.include({ 'publicKey[0].id': didweb + '#key' })
  })
  it('should contain the authentication and assertionMethod section', () => {
    expect(diddoc).to.nested.include({ 'authentication[0].publicKey': didweb + '#key' })
    expect(diddoc).to.nested.include({ 'assertionMethod[0].publicKey': didweb + '#key' })
  })
})
