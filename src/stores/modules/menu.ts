import { defineStore } from 'pinia';
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE } from '@/setting/localeSetting';
import type { LayoutRoute } from '@/hooks/menu';
import type { RouteRecordName } from 'vue-router';
import { pinia } from '..';

export type MenuTab = {
  path: string;
  name: RouteRecordName | null | undefined;
};

interface MenuState {
  userRoutes: LayoutRoute[];
  menuList: any;
  fold: boolean;
  isDynamicAddedRoute: boolean;
  menuTab: MenuTab[];
  selectedMenu: string;
}

const useStorage = useStorageHook();
const { getObjectStorage } = useStorage;

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => {
    return {
      userRoutes: [],
      menuList: [],
      fold: false,
      isDynamicAddedRoute: false,
      menuTab: [{ name: '首页', path: '/' }],
      selectedMenu: '/',
    };
  },
  actions: {
    initMenuTab() {
      this.menuTab = getObjectStorage(localStorage, MAY_STORAGE, 'menuTab') || [{ name: '首页', path: '/' }];
    },
    setUserRoutes(routerMap: LayoutRoute[]) {
      this.userRoutes = routerMap;
    },
    setMenuList(menuList: any) {
      this.menuList = menuList;
    },
    setIsDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    toggleMenu() {
      this.fold = !this.fold;
    },
    setMenuTab(menuTab: MenuTab) {
      const index = this.menuTab.findIndex((item) => {
        return item.path == menuTab.path;
      });
      if (index !== -1) return;
      this.menuTab.push(menuTab);
      useStorage.setObjectStorage(localStorage, MAY_STORAGE, 'menuTab', this.menuTab);
    },
    setSelectedMenu(path: string) {
      this.selectedMenu = path;
    },
    removeMenuTab(menuTab: MenuTab) {
      const index = this.menuTab.findIndex((item) => {
        return item.path == menuTab.path;
      });
      this.menuTab.splice(index, 1);
      useStorage.setObjectStorage(localStorage, MAY_STORAGE, 'menuTab', this.menuTab);
    },
    removeAllMenuTab() {
      useStorage.removeObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab');
    },
  },
  getters: {
    getUserRoutes(): LayoutRoute[] {
      return this.userRoutes;
    },
    getMenuTab(): MenuTab[] {
      return this.menuTab;
    },
    getSelectedMenu(): string {
      return this.selectedMenu;
    },
    getMenuList(): any {
      return this.menuList;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
});

// 解决外部文件调用pinia时pinia未挂载问题
export function useMenuStoreWithOut() {
  return useMenuStore(pinia);
}
