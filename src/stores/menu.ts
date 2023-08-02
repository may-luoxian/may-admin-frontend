import { defineStore } from 'pinia';
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE } from '@/setting/localeSetting';
import type { LayoutRoute } from '@/hooks/menu';
import type { RouteRecordName } from 'vue-router';

export type MenuTab = {
  path: string;
  name: RouteRecordName | null | undefined;
};

interface MenuState {
  userRoutes: LayoutRoute[];
  fold: boolean;
  menuTab: MenuTab[];
}

const useStorage = useStorageHook();
const { getObjectStorage } = useStorage;

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => {
    return {
      userRoutes: [],
      fold: false,
      menuTab: [{ name: '首页', path: '/' }],
    };
  },
  actions: {
    initMenuTab() {
      this.menuTab = getObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab') || [{ name: '首页', path: '/' }];
    },
    setUserRoutes(routerMap: LayoutRoute[]) {
      this.userRoutes = routerMap;
    },
    toggleMenu() {
      this.fold = !this.fold;
    },
    setMenuTab(menuTab: MenuTab) {
      let index = this.menuTab.findIndex((item) => {
        return item.path == menuTab.path;
      });
      if (index !== -1) return;
      this.menuTab.push(menuTab);
      useStorage.setObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab', this.menuTab);
    },
    removeMenuTab(menuTab: MenuTab) {
      let index = this.menuTab.findIndex((item) => {
        return item.path == menuTab.path;
      });
      this.menuTab.splice(index, 1);
      useStorage.setObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab', this.menuTab);
    },
  },
  getters: {
    getUserRoutes(): LayoutRoute[] {
      return this.userRoutes;
    },
    getMenuTab(): MenuTab[] {
      return this.menuTab;
    },
  },
});