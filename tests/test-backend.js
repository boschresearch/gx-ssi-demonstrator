const { assert, expect } = require('chai')
const chai = require('chai')
const should = chai.should()
// const assert = chai.assert
const api = require('../server-middleware/api')

const URL_DOMAIN_PORT_USER = 'http://example.com:8080/user1'
const URL_DOMAIN_USER = 'http://example.com/user1'
const URL_DOMAIN_USER_PATH = 'http://example.com/api/something/user1'

describe('utils URL transformation to did:web', () => {
  it('should be empty string with a given port', () => {
    const didweb = api.buildDidWebFromUrl(URL_DOMAIN_PORT_USER)
    expect(didweb).to.equal('')
  })
  it('should convert without port', () => {
    const didweb = api.buildDidWebFromUrl(URL_DOMAIN_USER)
    expect(didweb).to.equal('did:web:example.com:user1')
  })
  it('should convert multiple path parts', () => {
    const didweb = api.buildDidWebFromUrl(URL_DOMAIN_USER_PATH)
    expect(didweb).to.equal('did:web:example.com:api:something:user1')
  })
})
