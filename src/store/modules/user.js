export default {
  namespaced: true,
  state: {
    profile: {
      id: '321',
      avatar: '',
      nickname: '',
      account: '',
      mobile: '',
      token: '3123123'
    }
  },
  mutations: {
    setProfile (state, payload) {
      state.profile = payload
    }
  }
}
