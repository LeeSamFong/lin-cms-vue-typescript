import { LinRouteType } from '@/router/route-type'

const adminRouter: LinRouteType = {
  filePath: 'views/admin',
  inNav: true,
  name: Symbol('权限管理'),
  route: '',
  title: '权限管理',
  type: 'folder',
  icon: 'iconfont icon-huiyuanguanli',
  permission: ['超级管理员独有权限'],
  children: [
    {
      route: '/admin/user',
      name: Symbol('用户管理'),
      title: '用户管理',
      type: 'folder', // 取 route 为默认加载页
      icon: 'iconfont icon-huiyuanguanli',
      filePath: 'view/admin/user/',
      inNav: true,
      children: [
        {
          title: '用户列表',
          type: 'view',
          name: Symbol('userList'),
          route: '/admin/user/list',
          filePath: 'views/admin/user/user-list.vue',
          inNav: true,
          icon: 'iconfont icon-huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          title: '添加用户',
          type: 'view',
          inNav: true,
          route: '/admin/user/add',
          icon: 'iconfont icon-add',
          name: Symbol('UserCreate'),
          filePath: 'views/admin/user/user-create.vue',
          permission: ['超级管理员独有权限'],
        },
      ],
    },
    {
      route: '/admin/group/list',
      name: Symbol('分组管理'),
      title: '分组管理',
      type: 'tab', // 取 route 为默认加载页
      icon: 'iconfont icon-yunyingguanli_fuwufenzuguanli',
      filePath: 'views/admin/group',
      inNav: true,
      children: [
        {
          route: '/admin/group/list',
          type: 'view',
          name: Symbol('groupList'),
          inNav: true,
          filePath: 'views/admin/group/group-list.vue',
          title: '分组列表',
          icon: 'iconfont icon-huiyuanguanli',
          permission: ['超级管理员独有权限'],
        },
        {
          route: '/admin/group/add',
          type: 'view',
          name: Symbol('GroupCreate'),
          filePath: 'views/admin/group/group-create.vue',
          inNav: true,
          title: '添加分组',
          icon: 'iconfont icon-add',
          permission: ['超级管理员独有权限'],
        },
        // {
        //   route: '/admin/group/edit',
        //   type: 'view',
        //   name: Symbol('GroupEdit'),
        //   filePath: 'views/admin/group/group-edit.vue',
        //   inNav: false,
        //   title: '修改分组',
        //   icon: 'iconfont icon-add',
        //   permission: ['超级管理员独有权限'],
        // },
      ],
    },
  ],
}

export default adminRouter
