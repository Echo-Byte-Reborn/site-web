import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import Bootstrap from '@/bootstrap'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
import 'material-components-web/dist/material-components-web.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
    matRed: colors.red.accent3
  }
})

Vue.config.productionTip = false
Vue.use(Bootstrap)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
