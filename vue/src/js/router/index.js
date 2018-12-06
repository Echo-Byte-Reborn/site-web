import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import OtherPage from '../components/OtherPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      name: 'OtherPage',
      path: '/page',
      component: OtherPage
    }
  ]
})
