import { instance } from '@/api/api';

export default {
  // 登录
  login: (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return instance.post('/users/login', params);
  },
  // 登出
  logout: (userId: number) => {
    return instance.get('/admin/users/logout', {
      params: {
        userId,
      },
    });
  },
};

import { defHttp } from '@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/requestEnum';

export const login = (username: string, password: string) => {
  const data = {
    username,
    password,
  };
  return defHttp.post({
    url: '/users/login',
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
};
