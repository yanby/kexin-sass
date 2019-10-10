import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//登录注册
import login from '@/components/login'
import register from '@/components/register'
import findPassword from '@/components/findPassword'
//农场列表
import farmList from '@/components/farmList'
import farmDetail from '@/components/farmDetail'
import farmFecord from '@/components/farmFecord'
//信用监测
import farmMonitor from '@/components/farmMonitor'
//消息中心
import message from '@/components/message'
//账户信息
import account from '@/components/account'
//修改密码
import updatePassword from '@/components/updatePassword'
//完善资料
import perfect from '@/components/perfect'

Vue.use(Router)


const router = new Router({
  mode: "history",
  scrollBehavior: ()=>({y:0}),//路由切换以后返回到顶部
  routes: [
    {
      path: '*',
      component: login
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/findPassword',
      component: findPassword
    },
    {
      path: '/farmList',
      component: farmList,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/farmDetail',
      component: farmDetail,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/farmFecord',
      component: farmFecord,
      meta: {
        requireAuth: true
      }
    },
    {
        path: '/farmMonitor',
      component: farmMonitor,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/message',
      component: message,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/account',
      component: account,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/updatePassword',
      component: updatePassword,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/perfect',
      component: perfect,
      meta: {
        requireAuth: true
      }
    }
  ]
})


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((from, to, next) => {
  if (from.meta.requireAuth) { // 判断跳转的路由是否需要登录
    if (localStorage.token) { // vuex.state判断token是否存在
      next() // 已登录
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router;
