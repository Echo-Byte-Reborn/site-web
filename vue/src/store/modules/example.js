import * as types from '@/store/mutationTypes'

const state = {
  text: ''
}

const mutations = {
  [types.SET_EXAMPLE_TEXT] (state, text) {
    state.text = text
  }
}

const actions = {
  setText ({ commit }, text) {
    if (text) {
      commit(types.SET_EXAMPLE_TEXT, text)
    }
  }
}

const getters = {
  getText: state => state.text
}

export default {
  state,
  getters,
  mutations,
  actions
}
