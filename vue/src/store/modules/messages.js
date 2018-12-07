import * as types from '@/store/mutationTypes'
import $ from 'jquery'

const state = {
  messages: []
}

const mutations = {
  [types.SET_MESSAGES] (state, messages) {
    state.messages = messages
  }
}

const actions = {
  async loadMessages ({ commit }) {
    return new Promise(resolve => {
      try {
        $.ajax('http://51.68.87.119:8080/message', {
          method: 'GET',
          success: res => {
            commit(types.SET_MESSAGES, res.data)
          },
          error: error => {
            console.error('error', error)
            resolve(false)
          }
        })
      } catch (error) {
        console.error(error)
        resolve(false)
      }
    })
  }
}

const getters = {
  getMessages: state => state.messages
}

export default {
  state,
  getters,
  mutations,
  actions
}
