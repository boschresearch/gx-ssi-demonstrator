
const buildDidDocument = function (didweb, pubKey, keyType) {
  const keyid = didweb + '#key'
  const publicKeySection = [
    {
      id: keyid,
      type: keyType,
      controller: didweb,
      publicKeyBase58: pubKey
    }
  ]
  const diddoc = {
    // '@context': 'https://w3id.org/did/v1',
    '@context': 'https://www.w3.org/ns/did/v1',
    id: didweb,
    verificationMethod: publicKeySection,
    publicKey: publicKeySection,
    authentication: [
      {
        type: keyType,
        publicKey: keyid
      }
    ],
    assertionMethod: [
      {
        type: keyType,
        publicKey: keyid
      }
    ]
  }
  return diddoc
}

module.exports = {
  buildDidDocument
}
