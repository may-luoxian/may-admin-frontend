import api from "@/api/api";
import router from "@/router";
import _ from "lodash";
// import { useUserStore } from "@/stores/user";
import { useMenuStore } from "@/stores/menu";
import { Layout } from "@/components/layout";
import { treeToList } from "@/utils";
import { createPinia } from "pinia";
const pinia = createPinia();

const modules = import.meta.glob("@/views/**/*.vue");
// const userStore = useUserStore(pinia);
const menuStore = useMenuStore(pinia);

export type LayoutRoute = {
  id: Symbol;
  menuType: number;
  parentId: number | null;
  path: string;
  component: any;
  icon: string | null;
  name: string;
  hidden: boolean;
  children: Array<LayoutRoute>;
};

/**
 * 构建路由表
 * @param routerMap 路由表
 * 1、生成路由表深度为2
 * 2、打平路由表，若当前森林根节点只有一层且为菜单，需要在该层添加Layout层
 * 3、若当前森林存在多层，则只保留根结点目录和该根结点下所有菜单，将根结点下所有菜单作为根节点的children
 * 4、构建路由表，若为目录，替换组件为Layout，否则根据路径引入组件
 */
function buildAsyncRouterMap(routerMap: Array<LayoutRoute> = []) {
  if (routerMap.length === 0) {
    return null;
  }
  routerMap.forEach((route: LayoutRoute) => {
    if (route.children && route.children.length !== 0) {
      route.children = treeToList(route.children);
      route.children.forEach((childRoute: LayoutRoute, index: number) => {
        if (childRoute.menuType === 1) {
          route.children.splice(index, 1);
        }
      });
    }
  });
  routerMap.forEach((route: LayoutRoute, index: number) => {
    if (route.menuType === 2) {
      routerMap[index] = buildLayout(route);
    }
  });
  routerMap.forEach((route: LayoutRoute) => {
    if (route.component === "Layout") {
      route.component = Layout;
    } else {
      route.component = modules["/src/views" + route.component];
    }
    if (route.children && route.children.length !== 0) {
      route.children.forEach((childRoute) => {
        childRoute.component = modules["/src/views" + childRoute.component];
      });
    }
  });
  return routerMap;
}

/**
 * 构建最外层Layout
 */
function buildLayout(route: LayoutRoute) {
  let data: LayoutRoute = {
    id: route.id,
    name: route.name,
    hidden: route.hidden,
    path: "/",
    component: "Layout",
    menuType: 1,
    parentId: null,
    icon: null,
    children: [],
  };
  data.children.push(route);
  return data;
}

export const useMenu = () => {
  //动态添加路由
  async function dynamicAddRoute() {
    //后端返回的数据直接作为菜单表
    let routerData = (await api.getSystemMenu()).data;
    menuStore.setMenuTable(routerData);
    //路由表
    let temp = _.cloneDeep(routerData);
    let routerMap = buildAsyncRouterMap(temp);
    menuStore.setUserRoutes(routerMap);
    routerMap?.forEach((route: any) => {
      router.addRoute(route);
    });
  }
  return {
    dynamicAddRoute,
  };
};
