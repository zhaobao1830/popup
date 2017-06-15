import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Firstpopup from '../components/desktop.vue'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Firstpopup',
      component: Firstpopup
    }
  ]
})
