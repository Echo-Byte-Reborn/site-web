import Vue from 'vue'
import Vuex from 'vuex'

import example from '@/store/modules/example'
import messages from '@/store/modules/messages'
import dark from '@/store/modules/dark'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    example,
    messages,
    dark
  }
})
