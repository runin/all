// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import vueTap from 'v-tap'
import VueRouter from 'vue-router'

import App from './App.vue'
import Index from './components/index.vue'
import Yao from './components/yao.vue'

Vue.use(vueTap)
Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'index', component: Index},
  {path: '/yao', name: 'yao', component: Yao}
]

const router = new VueRouter({
  routes: routes
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// 全局总线
window.eventHub = new Vue()
