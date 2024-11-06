import { defHttp } from '@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/requestEnum';

export const login = (username: string, password: string) => {
  const data = {
    username,
    password,
  };
  return defHttp.post({
    url: '/auth/users/login',
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
};

export const logout = (userId: number) => {
  return defHttp.get({
    url: '/admin/users/logout',
    params: {
      userId,
    },
  });
};

export const getUserInfo = () => {
  return defHttp.get({
    url: '/admin/users/info',
  });
};

// 获取当前用户路由
export const getUserRouter = () => {
  return defHttp.get({
    url: '/admin/menus/user',
  });
};

// 获取角色列表
export const getRoles = () => {
  return defHttp.get({
    url: '/admin/role/allow',
  });
};
