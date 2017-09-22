import Vue from 'vue'
import Router from 'vue-router'
import VueSweetAlert from 'vue-sweetalert'
import ContextMenu from 'vue-context-menu'
import ContentEditable from '../plugins/content-editable'

Vue.use(Router)
Vue.use(VueSweetAlert)
Vue.use(ContextMenu)
Vue.use(ContentEditable)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'connections',
      component: require('@/components/Connections')
    },
    {
      path: '/connected',
      component: require('@/components/Connected'),
      children: [
        {
          path: '', // Default path
          name: 'connected',
          component: require('@/components/Structure')
        }
      ]
    },
    {
      path: '/structure',
      name: 'structure',
      component: require('@/components/Structure')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
