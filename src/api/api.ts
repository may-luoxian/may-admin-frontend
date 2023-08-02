import axios from 'axios';
import { app } from '@/main';
import Cookies from 'js-cookie';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
// import { ResData } from "@/api/types";

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers['Authorization'] = Cookies.get('token');
  return config;
});

instance.interceptors.response.use(
  (config: AxiosResponse): AxiosResponse => {
    if (config.data.code !== 20000) {
      app.config.globalProperties.$notify({
        title: 'Error',
        message: config.data.message,
        type: 'error',
      });
    }
    return config.data;
  },
  (error: AxiosResponse): Promise<AxiosResponse> => {
    return Promise.reject(error);
  }
);

export default {
  // 登录
  login: (username: string, password: string) => {
    let params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return instance.post('/users/login', params);
  },
  // 获取用戶菜单
  getSystemMenu: () => {
    return instance.get('/admin/user/menus');
  },
  // 获取菜单列表
  getMenus: () => {
    return instance.get('/admin/menus');
  },
};
