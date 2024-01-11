import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { useStorageHook } from '@/hooks/storage';
import { useMenuStore } from '@/stores/modules/menu';
import { MAY_STORAGE, MAY_BLOG_TOKEN } from '@/setting/localeSetting';
import { pinia } from '..';

const storageHook = useStorageHook();

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '' as string,
      userInfo: storageHook.getObjectStorage(localStorage, MAY_STORAGE, 'user') || {},
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      Cookies.set(MAY_BLOG_TOKEN, token, {
        expires: 1,
      });
    },
    setUserInfo(data: any) {
      this.userInfo = data;
      storageHook.setObjectStorage(localStorage, MAY_STORAGE, 'user', data);
    },
    removeToken() {
      this.token = '';
      Cookies.remove(MAY_BLOG_TOKEN);
    },
    removeUserInfo() {
      this.userInfo = {};
      storageHook.removeObjectStorage(localStorage, MAY_STORAGE, 'user');
    },
    clearOnlineStorage() {
      this.removeToken();
      this.removeUserInfo();
      const menuStore = useMenuStore();
      menuStore.removeAllMenuTab();
    },
  },
  getters: {
    getToken(): string {
      return this.token;
    },
    getUserInfo(): any {
      return this.userInfo;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(pinia);
}
