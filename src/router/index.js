import { createRouter, createWebHashHistory } from 'vue-router'

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
      }
    ]
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

export default router
