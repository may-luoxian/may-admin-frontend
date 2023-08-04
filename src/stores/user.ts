import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { useStorageHook } from '@/hooks/storage';

const storageHook = useStorageHook();

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '' as string,
      userInfo: {},
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      Cookies.set('token', token, {
        expires: 1,
      });
    },
    setUserInfo(data: any) {
      this.userInfo = data;
      localStorage.setItem('user', JSON.stringify(data));
    },
    removeToken() {
      this.token = '';
      Cookies.remove('token');
    },
    removeUserInfo() {
      this.userInfo = {};
      storageHook.removeStorage(localStorage, 'user');
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
