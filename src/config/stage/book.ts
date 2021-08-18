import { LinRouteType } from '@/router/route-type'

const bookRouter: LinRouteType = {
  route: '',
  name: Symbol(),
  title: '图书管理',
  type: 'folder',
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/book/', // 文件路径
  inNav: true,
  children: [
    {
      title: '图书列表',
      type: 'view',
      name: Symbol('BookCreate'),
      route: '/book/list',
      filePath: 'views/book/book-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '添加图书',
      type: 'view',
      name: Symbol('BookCreate'),
      route: '/book/add',
      filePath: 'views/book/book.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}


export default bookRouter
