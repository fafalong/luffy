import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import Login from '../components/login/login'
import Home from '../components/home/home'
import Users from '../components/user/users'
import Roles from '../components/role/roles'
import Rights from '../components/right/rights'
import Goods from '../components/good/goods'
import Goodsadd from '../components/good/goodsadd'
import Params from '../components/good/params'
import Categories from '../components/good/categories'
import Orders from '../components/order/orders'
import Reports from '../components/report/reports'

Vue.use(Router)


const router = new Router({routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users,
      }, {
        name: 'roles',
        path: 'roles',
        component: Roles,
      }, {
        name: 'rights',
        path: 'rights',
        component: Rights,
      }, {
        name: 'goods',
        path: 'goods',
        component: Goods,
      },
        {
          name: 'goodsadd',
          path: 'goodsadd',
          component: Goodsadd,
        },
        {
          name: 'params',
          path: 'params',
          component: Params,
        },
        {
          name: 'categories',
          path: 'categories',
          component: Categories,
        },
        {
          name: 'orders',
          path: 'orders',
          component: Orders,
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports,
        },
      ],

    },
  ]})

export default router

// 路由的前置守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        'name': 'login'
      })
      Message.warning('鉴权失效，请先登录')
      return
    }
    next()
  }
})
