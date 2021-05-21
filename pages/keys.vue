<!--
 Copyright (c) 2021 - for information on the respective copyright owner
 see the NOTICE file and/or the repository at
 https://github.com/boschresearch/gx-ssi-demonstrator

 SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div>
    <h1>Generate a keypair</h1>
    <v-btn @click="getUser()">Get User Information</v-btn>
    <pre>{{userinfo}}</pre>
    <v-btn @click="generateKey()">Generate...</v-btn>
    <pre>{{keyPair}}</pre>
  </div>
</template>

<script>
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018'

export default {
  data () {
    return {
    }
  },
  computed: {
    keyPair () {
      return this.$store.state.keyPair
    },
    userinfo () {
      return this.$store.state.userinfo
    }
  },
  methods: {
    async generateKey () {
      const keyPair = await Ed25519VerificationKey2018.generate({
        id: this.$store.state.userinfo.keyid,
        controller: this.$store.state.userinfo.controller
      })
      const keyPairExport = keyPair.export({ publicKey: true, privateKey: true, includeContext: true })
      // keyPairExport['@context'] = 'https://w3id.org/security/v2' // TODO: do we need this
      this.$store.commit('setKeyPair', keyPairExport) // stores entire key, including private key
      // send public key part to the server
      const pubKeyExport = keyPair.export({ publicKey: true, includeContext: true })
      // pubKeyExport['@context'] = 'https://w3id.org/security/v2' // TODO: do we need this
      const { data } = await this.$axios.post('/api/user/key', pubKeyExport)
      console.log('key publish result: ', data)
    },
    async getUser () {
      const { data } = await this.$axios.get('/api/userinfo')
      console.log(data)
      this.$store.commit('setUserinfo', data)
    }
  }
}
</script>

<style>

</style>
