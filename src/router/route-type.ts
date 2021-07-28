import { RouteRecordRaw } from 'vue-router'

export interface LinRouteType {
  // 页面title / 左侧sidebar
  title: string;

  // 使用 Symbol 确保唯一性，若未设置则默认为随机字符串
  name: symbol;

  // folder：有子路由，折叠sidebar
  // tab：子路由在右侧以menuTab展现
  // view：直接展示页面
  type: 'folder' | 'tab' | 'view';

  // 可直接配置 iconfont 类名 / 也可配置为图片路径
  icon?: string;

  // 当前页面路由
  route: string;

  // 文件路径
  filePath: string;

  // 路由排序
  order?: number;

  // 是否在左侧菜单栏显示
  inNav: boolean;

  // 当前路由权限，数组格式，满足数组内任一权限即可展示该页面
  permission?: string[];

  children?: LinRouteType[];

  blueBaseColor?: string;
}

export type SimpleLinRouteType = Pick<LinRouteType,
  | 'title'
  | 'icon'
  | 'permission'
  | 'type'>

export type LinRouteRecordRaw = RouteRecordRaw & {
  meta?: SimpleLinRouteType & {
    blueBaseColor: string;
  }
}
