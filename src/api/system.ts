import { instance } from '@/api/api';

export default {
  // 登录
  login: (username: string, password: string) => {
    let params = new URLSearchParams();
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
