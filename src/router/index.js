import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'
const Layout = () => import('@/views/Layout')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: () => import('@/views/home')
      },
      {
        path: '/category/:id?',
        component: () => import('@/views/category')
      },
      {
        path: '/category/sub/:id?',
        component: () => import('@/views/category/sub')
      },
      {
        path: '/product/:id',
        component: () => import('@/views/goods')
      },
      {
        path: '/cart',
        component: () => import('@/views/cart')
      },
      {
        path: '/member/checkout',
        component: () => import('@/views/member/pay/checkout')
      },
      {
        path: '/member/pay',
        component: () => import('@/views/member/pay')
      },
      {
        path: '/pay/callback',
        component: () => import('@/views/member/pay/result')
      },
      {
        path: '/member',
        component: () => import('@/views/member/Layout'),
        children: [
          {
            path: '/member',
            component: () => import('@/views/member/home')
          },
          // {
          //   path: '/member/order',
          //   component: () => import('@/views/member/order')
          // },
          // {
          //   path: '/member/order/:id',
          //   component: () => import('@/views/member/order/detail')
          // }
          {
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [
              {
                path: '',
                component: () => import('@/views/member/order')
              },
              {
                path: ':id',
                component: () => import('@/views/member/order/detail')
              }
            ]
          }
        ]
      }

    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/logincallback')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior () { // 控制路由跳转页面回到顶部
    return {
      left: 0, top: 0
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  // 需要登录的路由：地址是以/member开头
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    console.log(1)
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})
export default router
