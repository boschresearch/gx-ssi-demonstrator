export const state = () => ({
  keyPair: {}
})

export const mutations = {
  setKeyPair (state, keyPair) {
    console.log(keyPair)
    state.keyPair = keyPair
  }
}
