import Vue from 'vue'
import Router from 'vue-router'
import VueSweetAlert from 'vue-sweetalert'
import {Line, Bar} from '../components/charts'

Vue.use(Router)
Vue.use(VueSweetAlert)
Vue.component('line-chart', Line)
Vue.component('bar-chart', Bar)

export default new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/overview',
      name: 'overview',
      component: require('@/components/Overview')
    },
    {
      path: '/urls',
      name: 'urls',
      component: require('@/components/Urls')
    },
    {
      path: '*',
      redirect: '/overview'
    }
  ]
})
