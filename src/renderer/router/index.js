import Vue from 'vue'
import Router from 'vue-router'
import VueSweetAlert from 'vue-sweetalert'
import ContextMenu from 'vue-context-menu'

Vue.use(Router)
Vue.use(VueSweetAlert)
Vue.use(ContextMenu)

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
