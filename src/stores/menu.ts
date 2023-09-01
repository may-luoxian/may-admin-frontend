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
  menuList: any;
  fold: boolean;
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
      menuTab: [{ name: '首页', path: '/' }],
      selectedMenu: '/',
    };
  },
  actions: {
    initMenuTab() {
      this.menuTab = getObjectStorage(sessionStorage, MAY_STORAGE, 'menuTab') || [{ name: '首页', path: '/' }];
    },
    setUserRoutes(routerMap: LayoutRoute[]) {
      this.userRoutes = routerMap;
    },
    setMenuList(menuList: any) {
      this.menuList = menuList;
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
    setSelectedMenu(path: string) {
      this.selectedMenu = path;
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
  },
});
