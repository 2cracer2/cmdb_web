import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '仪表盘',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/asset',
    component: Layout,
    name: 'Asset',
    meta: {
      title: '资产管理',
      icon: 'table'
    },
    children: [
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/asset/server/index'),
        meta: { title: '服务器' }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'tree'
    },
    children: [
      {
        path: 'alldevice',
        name: 'AllDevice',
        component: () => import('@/views/device/index'),
        meta: { title: '设备' }
      }
    ]
  },
  {
    path: '/permissions',
    component: Layout,
    meta: {
      title: '权限管理',
      icon: 'user'
    },
    children: [
      {
        path: 'user',
        name: 'Users',
        component: () => import('@/views/permissions/users/index'),
        meta: { title: '用户管理' }
      },
      {
        path: 'group',
        name: 'Groups',
        component: () => import('@/views/permissions/groups/index'),
        meta: { title: '组管理' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    // redirect: '/nested/serverman',
    name: 'Nested',
    meta: {
      title: '服务管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'serverman',
        component: () => import('@/views/nested/serverman/index'), // Parent router-view
        name: 'Serverman',
        meta: { title: '服务器相关操作' },
        children: [
          {
            path: 'ipmicontrol',
            component: () => import('@/views/nested/serverman/ipmicontrol/'),
            name: 'Ipmicontrol',
            meta: { title: '电源管理' }
          },

          {
            path: 'systeminstall',
            component: () => import('@/views/nested/serverman/systeminstall/'),
            name: 'Systeminstall',
            meta: { title: '系统重装' },
            // children: [
            //   {
            //     path: 'menu1-2-1',
            //     component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
            //     name: 'Menu1-2-1',
            //     meta: { title: 'Menu1-2-1' }
            //   },
            //   {
            //     path: 'menu1-2-2',
            //     component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
            //     name: 'Menu1-2-2',
            //     meta: { title: 'Menu1-2-2' }
            //   }
            // ]
          }
        ]
      },
      {
        path: 'webterminal',
        component: () => import('@/views/nested/webterminal/index'),
        meta: { title: 'Web-Terminal' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://127.0.0.1:8000/admin/',
        meta: { title: 'Django 后台', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
