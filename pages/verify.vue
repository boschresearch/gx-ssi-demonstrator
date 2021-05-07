<template>
  <div>
    <h1>Verify an external Self-Description</h1>
    <v-text-field v-model="selfDescriptionUrl"></v-text-field>
    <v-btn @click="verify()">Verify</v-btn>
    <v-icon v-if="verified" color="green">mdi-shield-check-outline</v-icon>
    <v-icon v-else color="red">mdi-shield-alert-outline</v-icon>
    <pre>
      {{verificationResult}}
    </pre>
  </div>
</template>

<script>
import vc from 'vc-js'
import jsonld from 'jsonld'
import { Ed25519Signature2018 } from '@digitalbazaar/ed25519-signature-2018'

export default {
  data () {
    return {
      verified: null,
      verificationResult: '',
      selfDescriptionContent: null,
      selfDescriptionUrl: null
    }
  },
  methods: {
    async verify () {
      const { data } = await this.$axios.get(this.selfDescriptionUrl)
      this.selfDescriptionContent = data

      const result = await vc.verify({
        presentation: this.selfDescriptionContent,
        suite: new Ed25519Signature2018(),
        challenge: '123', // TODO: fix me
        documentLoader: jsonld.documentLoaders.xhr()
      })
      this.verificationResult = result
      this.verified = result.verified
    }
  }

}
</script>

<style>

</style>
