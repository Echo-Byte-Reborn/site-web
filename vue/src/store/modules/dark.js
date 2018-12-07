import * as types from '@/store/mutationTypes'

const state = {
  drak: true
}

const mutations = {
  [types.SET_DARK] (state, drak) {
    state.drak = drak
  }
}

const actions = {
  setDrak ({ commit }, drak) {
    commit(types.SET_DARK, drak)
  }
}

const getters = {
  getDark: state => state.drak
}

export default {
  state,
  getters,
  mutations,
  actions
}
