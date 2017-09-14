import Vue from 'vue'
import Router from 'vue-router'
import VueSweetAlert from 'vue-sweetalert'

Vue.use(Router)
Vue.use(VueSweetAlert)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'connections',
      component: require('@/components/Connections')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
