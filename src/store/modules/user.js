export default {
  namespaced: true,
  state: {
    profile: {
      id: '',
      avatar: '',
      nickname: '',
      account: '',
      mobile: '',
      token: ''
    },
    redirectUrl: '/'
  },
  mutations: {
    setProfile (state, payload) {
      state.profile = payload
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
