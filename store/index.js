export const state = () => ({
  keyPair: {},
  userinfo: {}
})

export const mutations = {
  setKeyPair (state, keyPair) {
    console.log(keyPair)
    state.keyPair = keyPair
  },
  setUserinfo (state, userinfo) {
    state.userinfo = userinfo
  }
}
