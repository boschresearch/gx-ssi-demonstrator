<!--
 Copyright (c) 2021 - for information on the respective copyright owner
 see the NOTICE file and/or the repository at
 https://github.com/boschresearch/gx-ssi-demonstrator

 SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div>
    <h1>Issue Organization Credential</h1>
    <v-text-field
      v-model="legalName"
      hint="The legalName that is going to be issued"
      label="Organization Name">
    </v-text-field>
    <v-text-field
      v-model="holder"
      hint="e.g. http://localhost/user1"
      label="Holder / Receiver / Subject ID">
    </v-text-field>
    <v-btn @click="createVC()">Create</v-btn>
    <br/><br/>
    <v-btn alt small @click="copyToClipboard()" v-if="credential"><v-icon>mdi-content-copy</v-icon></v-btn><pre>{{credential}}</pre>
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
      legalName: '',
      holder: '',
      credential: null
    }
  },
  methods: {
    async createVC () {
      try {
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
            id: this.holder,
            type: ['LEIentity'],
            legalName: this.legalName
          }
        }
        console.log('credential', credential)

        const keypairObj = this.$store.state.keyPair
        console.log('keypairObj', keypairObj)
        const keyPair = await Ed25519VerificationKey2018.from(keypairObj)
        const suite = new Ed25519Signature2018({
          verificationMethod: keypairObj.id,
          controller: keypairObj.controller,
          key: keyPair
        })
        console.log('suite', suite)

        const verifiableCredential = await vc.issue({
          credential,
          suite,
          compactProof: false, // security-v2 issues
          documentLoader: jsonld.documentLoaders.xhr()
        })
        console.log('verifiableCredential', verifiableCredential)
        this.credential = verifiableCredential
      } catch (e) {
        console.log('catch', JSON.stringify(e, null, 4))
        console.log('catch2', e)
      }
    },
    copyToClipboard () {
      navigator.clipboard.writeText(JSON.stringify(this.credential, null, 4))
    }
  }

}
</script>

<style>

</style>
