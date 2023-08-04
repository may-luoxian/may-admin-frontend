import api from '@/api/api';
import router from '@/router';
import pinia from '@/stores';
import _ from 'lodash';
import { useMenuStore } from '@/stores/menu';
import { Layout } from '@/components/layout';
import type { RouteMeta } from 'vue-router';
import { useUserStore } from '@/stores/user';

const modules = import.meta.glob('@/views/**/*.vue');
const menuStore = useMenuStore(pinia);
const userStore = useUserStore();

// 路由表类型
export type LayoutRoute = {
  id: Number;
  menuType: number;
  parentId: number | null;
  path: string;
  meta: RouteMeta;
  component: any;
  icon: string | null;
  name: string;
  hidden: boolean;
  children: Array<LayoutRoute>;
};

/**
 * 初始化路由根结点
 * @returns 路由根结点
 */
function initParentRouter(): LayoutRoute {
  return {
    id: 0,
    name: 'root',
    hidden: false,
    path: '/',
    meta: { menuType: 0 },
    component: Layout,
    menuType: 1,
    parentId: null,
    icon: null,
    children: [],
  };
}

/**
 * 构建路由表
 * @param routerMap 路由数据
 * 递归替换路由组件、菜单图标
 */
function buildAsyncRouterMap(routerMap: Array<LayoutRoute> = []): Array<LayoutRoute> {
  if (routerMap.length === 0) {
    return [];
  }
  routerMap.forEach((route: LayoutRoute) => {
    route.icon = 'iconfont ' + route.icon;
    let meta = {
      menuType: route.menuType,
    };
    route.meta = meta;
    if (route.menuType === 1) {
      route.component = modules['/src/views' + route.component];
    } else {
      route.component = null;
    }
    if (route.children && route.children.length !== 0) {
      buildAsyncRouterMap(route.children);
    }
  });
  return routerMap;
}

export const useMenuHook = () => {
  /**
   * 动态添加路由
   * 1、获取菜单数据
   * 2、初始化根结点
   * 3、构建异步路由表
   * 4、添加路由
   */
  async function dynamicAddRoute() {
    try {
      let data: any = await api.getSystemMenu();
      if (data.code === 20000) {
        let routerData = data.data;
        let routerParent = initParentRouter();
        routerParent.children = buildAsyncRouterMap(routerData);
        menuStore.setUserRoutes(routerParent.children);
        router.addRoute(routerParent);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      router.push('/login')
      userStore.removeToken();
      userStore.removeUserInfo();
      console.error(err);
    }
  }
  return {
    dynamicAddRoute,
  };
};
