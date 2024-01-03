import axios from 'axios';
import { app } from '@/main';
import Cookies from 'js-cookie';
import { MAY_BLOG_TOKEN } from '@/setting/localeSetting';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import system from '@/api/system';

const requestQueue = new Map();
function getRequestKey(config: cancelAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

interface cancelAxiosRequestConfig extends InternalAxiosRequestConfig {
  isOpenCancel?: boolean;
}

function addRequestMessage(config: cancelAxiosRequestConfig) {
  if (!config.isOpenCancel) {
    return;
  }
  const requestKey = getRequestKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!requestQueue.has(requestKey)) {
        requestQueue.set(requestKey, cancel);
      }
    });
}

function removePendingRequest(config: cancelAxiosRequestConfig | object) {
  const requestKey = getRequestKey(config as cancelAxiosRequestConfig);
  if (requestQueue.has(requestKey)) {
    const cancel = requestQueue.get(requestKey);
    cancel(requestKey);
    requestQueue.delete(requestKey);
  }
}

export const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

instance.interceptors.request.use((config: cancelAxiosRequestConfig): cancelAxiosRequestConfig => {
  config.headers['Authorization'] = Cookies.get(MAY_BLOG_TOKEN);
  removePendingRequest(config);
  addRequestMessage(config);
  return config;
});

instance.interceptors.response.use(
  (config: AxiosResponse): AxiosResponse => {
    removePendingRequest(config.config);
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
  (error: AxiosError): Promise<AxiosError> => {
    removePendingRequest(error.config || {});
    let errMsg: any = error;
    if (error.code === 'ERR_CANCELED') {
      errMsg = '操作过快，请勿重复请求';
    }
    app.config.globalProperties.$notify({
      title: 'Error',
      message: errMsg,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default {
  ...system,
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
  getResources: (params: any) => {
    return instance.get('/admin/resources', {
      params,
    });
  },
  // 新增或修改资源
  saveOrUpdateResource: (formData: any) => {
    return instance.post('/admin/resource', formData);
  },
  // 新增或修改角色菜单权限
  saveOrUpdateMenuAuth: (params: any) => {
    return instance.post('/admin/role/menus', params);
  },
  // 新增或修改角色资源权限
  saveOrUpdateResourceAuth: (params: any) => {
    return instance.post('/admin/role/resources', params);
  },
  // 获取用户列表
  getUserList: (params: any) => {
    return instance.get('/admin/users', {
      params,
    });
  },
  getRoleAllow: () => {
    return instance.get('/admin/role/allow');
  },
  updateRoleAllow: (params: any) => {
    return instance.put('/admin/role/allow', params);
  },
  // 导出模板
  exportModel: () => {
    return instance.get('/excel/exportModel');
  },
};
