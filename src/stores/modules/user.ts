import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { useStorageHook } from '@/hooks/storage';
import { MAY_STORAGE, MAY_BLOG_TOKEN } from '@/hooks/storage';
import { pinia } from '..';

const storageHook = useStorageHook();
const { getObjectStorage, setObjectStorage, removeObjectStorage, removeStorage } = storageHook;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '' as string,
      userInfo: getObjectStorage(localStorage, MAY_STORAGE, 'user') || {},
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
      setObjectStorage(localStorage, MAY_STORAGE, 'user', data);
    },
    removeToken() {
      this.token = '';
      Cookies.remove(MAY_BLOG_TOKEN);
    },
    removeUserInfo() {
      this.userInfo = {};
      removeObjectStorage(localStorage, MAY_STORAGE, 'user');
    },
    clearOnlineStorage() {
      this.removeToken();
      removeStorage(localStorage, MAY_STORAGE);
      removeStorage(sessionStorage, MAY_STORAGE);
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
