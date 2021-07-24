import { RouteRecordRaw } from 'vue-router'
import Config from '@/config'
import homeRouter from '@/router/home-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: Config.defaultRoute || '/about',
    component: () => import('@/views/home/home.vue'),
    children: [...homeRouter],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login.vue'),
  },
  // TODO
  // {
  //   redirect: '/error-page',
  //   path: '/:pathMatch(.*)',
  // },
]

export default routes
