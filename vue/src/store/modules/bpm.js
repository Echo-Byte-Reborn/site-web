import * as types from '@/store/mutationTypes'
import $ from 'jquery'

const state = {
  lastBpm: {}
}

const mutations = {
  [types.SET_LAST_BPM] (state, lastBpm) {
    state.lastBpm = lastBpm
  }
}

let launch = false

const actions = {
  async loadLastBpm ({ commit }) {
    if (!launch) {
      launch = true

      setInterval(() => {
        return new Promise(resolve => {
          try {
            $.ajax('http://51.68.87.119:8080/bpm/last', {
              method: 'GET',
              success: res => {
                commit(types.SET_LAST_BPM, res)
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
      }, 1000)
    }
  }
}

const getters = {
  getLastBpm: state => state.lastBpm
}

export default {
  state,
  getters,
  mutations,
  actions
}
