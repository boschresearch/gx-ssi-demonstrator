<template>
  <div>
    <h1>Credentials</h1>
    <v-btn @click="createVC()">Create new</v-btn>
    <pre>{{credential}}</pre>
  </div>
</template>

<script>
import vc from 'vc-js'
import jsonld from 'jsonld'
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018'
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018'

export default {
  data () {
    return {
      credential: {}
    }
  },
  methods: {
    async createVC () {
      const credential = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/traceability/v1'
        ],
        id: new Date().getTime().toString(),
        type: ['VerifiableCredential'],
        issuer: this.$store.state.keyPair.controller,
        issuanceDate: '2010-01-01T19:23:24Z',
        credentialSubject: {
          id: this.$store.state.keyPair.controller,
          type: ['LEIentity'],
          legalName: 'Automotive Parts Unlimited'
        }
      }

      const keyPair = await Ed25519VerificationKey2018.from(this.$store.state.keyPair)
      const suite = new Ed25519Signature2018({
        verificationMethod: this.$store.state.keyPair.id,
        controller: this.$store.state.keyPair.controller,
        key: keyPair
      })

      const verifiableCredential = await vc.issue({
        credential,
        suite,
        compactProof: false, // security-v2 issues
        documentLoader: jsonld.documentLoaders.xhr
      })
      this.credential = verifiableCredential
    }
  }

}
</script>

<style>

</style>
