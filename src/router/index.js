import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import desktop from '../components/desktop.vue'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: desktop
    }
  ]
})
