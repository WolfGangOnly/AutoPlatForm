import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/page/Home'
import AutoMain from '@/components/page/AutoMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/AutoMain',
      name: 'AutoMain',
      component: AutoMain
    },{
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
