<template>
  <div>
    <h1>Generate a keypair</h1>
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
    }
  },
  methods: {
    async generateKey () {
      const keyPair = await Ed25519VerificationKey2018.generate({
        id: 'http://localhost:3000/api/user/user1/key',
        controller: 'http://localhost:3000/api/user/user1'
      })
      const keyPairExport = keyPair.export({ publicKey: true, privateKey: true })
      keyPairExport['@context'] = 'https://w3id.org/security/v2' // TODO: do we need this
      this.$store.commit('setKeyPair', keyPairExport)
    }
  }
}
</script>

<style>

</style>
