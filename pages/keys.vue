<template>
  <div>
    <h1>Generate a keypair</h1>
    <v-btn @click="generateKey()">Generate...</v-btn>
    <pre>{{keypair}}</pre>
  </div>
</template>

<script>
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018'

export default {
  data () {
    return {
      keypair: {}
    }
  },
  methods: {
    async generateKey () {
      const keypair = await Ed25519VerificationKey2018.generate()
      this.keypair = keypair
    }
  }
}
</script>

<style>

</style>
