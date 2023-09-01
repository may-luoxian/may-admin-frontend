import api from '@/api/api';
import router from '@/router';
import pinia from '@/stores';
import { cloneDeep, omit } from 'lodash-es';
import { useMenuStore } from '@/stores/menu';
import { Layout } from '@/components/layout';
import { treeMap } from '@/utils';
import type { RouteMeta, Router, RouteRecordNormalized } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { createRouter, createWebHashHistory } from 'vue-router';

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

// 单级菜单加壳
function singleMenuAddShell(modules: any, route: any, index: number): any {
  modules[index] = {
    name: route.name + '.Shell',
    hidden: route.hidden,
    path: route.path + 'shell',
    meta: { menuType: 0 },
    component: 'Layout',
    menuType: 0,
    parentId: null,
    icon: null,
    children: [route],
  };
}

/**
 * 格式化路由icon、component、meta
 * 递归替换路由组件、菜单图标、meta数据
 * @param routerMap 路由数据
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
    }
    if (route.children && route.children.length !== 0) {
      buildAsyncRouterMap(route.children);
    }
  });
  return routerMap;
}

// 将路由转换成菜单
function transformRouteToMenu(routes: any) {
  let cloneModList = cloneDeep(routes);
  let list = treeMap(cloneModList, {
    conversion: (node: any) => {
      return {
        name: node.name,
        path: node.path,
        meta: node.meta,
        icon: node.icon,
      };
    },
  });
  return list;
}

// 将多级路由转换为二级路由，路由分模块加壳
function flatMultiLevelRoutes(routes: any) {
  let modules = cloneDeep(routes);
  // 判断第一层级是否为菜单
  for (let index = 0; index < modules.length; index++) {
    if (modules[index].menuType === 1) {
      // 菜单加壳
      singleMenuAddShell(modules, modules[index], index);
    }
    let routeModule = modules[index];
    // 一级添加Layout组件
    addLayout(routeModule);
    // 判断是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    // 路由等级提升
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// 判断级别是否超过2级
function isMultipleRoute(routeModule: LayoutRoute) {
  // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

// 对于多级路由，进行等级提升
function promoteRouteLevel(routeModule: any) {
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });
  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  // omit lodash的函数 对传入的item对象的children进行删除
  routeModule.children = routeModule.children?.map((item: any) => omit(item, 'children'));
}

// 将所有子路由添加到二级路由
function addToChildren(routes: RouteRecordNormalized[], children: any[], routeModule: any) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];

    if (!routeModule.children.find((item: any) => item.name === route.name)) {
      routeModule.children?.push(route);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

function addLayout(routeModule: any) {
  if (routeModule.component === 'Layout') {
    routeModule.component = Layout;
  }
}

export const useMenuHook = () => {
  /**
   * 动态添加路由
   */
  async function dynamicAddRoute() {
    try {
      let data: any = await api.getSystemMenu();
      if (data.code === 20000) {
        let routes = data.data;
        // 格式化路由icon、component、meta
        routes = buildAsyncRouterMap(routes);
        // 将路由转换为菜单
        const menuList = transformRouteToMenu(routes);
        // 设置菜单列表
        menuStore.setMenuList(menuList);
        // 将多级路由转换为二级路由，路由分模块加壳
        routes = flatMultiLevelRoutes(routes);
        // 设置路由列表
        menuStore.setUserRoutes(routes);
        // 添加路由
        for (let route of routes) {
          router.addRoute(route);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      router.push('/login');
      userStore.removeToken();
      userStore.removeUserInfo();
      console.error(err);
    }
  }
  return {
    dynamicAddRoute,
  };
};
