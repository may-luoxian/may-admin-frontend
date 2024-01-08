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

export const logout = (userId: number) => {
  return defHttp.get({
    url: '/admin/users/logout',
    params: {
      userId,
    },
  });
};
