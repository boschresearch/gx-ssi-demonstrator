<template>
  <div>
    <h1>Manage Self-Description</h1>
    <v-textarea
      outlined
      label="Copy / Paste your Verifiable Credential into here:"
      v-model="vc">
    </v-textarea>
    <v-btn @click="addVC">Add</v-btn>
    <br/>
    <p>Credentials: {{credentials.length}}</p>
    <v-btn @click="createVP()">Create Self-Description</v-btn>
    <br/>
    <v-btn alt small @click="copyToClipboard()" v-if="presentation"><v-icon>mdi-content-copy</v-icon></v-btn>
    <pre>{{presentation}}</pre>
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
      vc: '',
      credentials: [],
      presentation: null
    }
  },
  methods: {
    addVC () {
      const vc = JSON.parse(this.vc)
      this.credentials.push(vc)
      this.vc = ''
    },
    async createVP () {
      const keypair = await Ed25519VerificationKey2018.from(this.$store.state.keyPair)
      console.log('keypair: ', keypair)

      const presentation = vc.createPresentation({
        id: new Date().getTime().toString(),
        verifiableCredential: this.credentials
        // holder: keypair.controller
      })
      console.log('presentation', presentation)

      const suite = new Ed25519Signature2018({
        verificationMethod: keypair.id,
        controller: keypair.controller,
        key: keypair
      })
      console.log('suite: ', suite)

      try {
        const vp = await vc.signPresentation({
          presentation,
          suite,
          challenge: '123',
          compactProof: false,
          documentLoader: jsonld.documentLoaders.xhr()
        })
        console.log('vp: ', vp)
        this.presentation = vp
      } catch (e) {
        console.log(e)
        console.log(JSON.stringify(e, null, 4))
      }
    },
    publishVP () {
      console.log('publishVP')
    },
    copyToClipboard () {
      navigator.clipboard.writeText(JSON.stringify(this.presentation, null, 4))
    }
  }

}
</script>

<style>

</style>
