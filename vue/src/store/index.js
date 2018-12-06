import Vue from 'vue'
import Vuex from 'vuex'

import example from '@/store/modules/example'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    example
  }
})