import axios from 'axios';
import { app } from '@/main';
import Cookies from 'js-cookie';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
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
      throw new Error(config.data.message);
    }
    return config.data;
  },
  (error: AxiosResponse): Promise<AxiosResponse> => {
    app.config.globalProperties.$notify({
      title: 'Error',
      message: error,
      type: 'error',
    });
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
  // 新增或修改菜单
  saveOrUpdateMenu: (formData: any) => {
    return instance.post('/admin/menus', formData);
  },
  // 获取角色列表
  getRoles: (params: any) => {
    return instance.get('/admin/roles', {
      params,
    });
  },
  // 获取角色菜单列表
  getRoleMenu: () => {
    return instance.get('/admin/role/menus');
  },
  // 获取角色资源列表
  getRoleResource: () => {
    return instance.get('/admin/role/resources');
  },
  // 获取资源列表
  getResources: () => {
    return instance.get('/admin/resources');
  },
};
