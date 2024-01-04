import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError, resultPageSuccess } from '../_util';

const demoList = (keywords, count: number = 20) => {
  const list = [] as any[];
  for (let index = 0; index < count; index++) {
    list.push({
      name: `${keywords ?? ''}选项${index + 1}`,
      id: index,
    });
  }
  return list;
};

export default [
  {
    url: '/api/tableDemo',
    method: 'get',
    response: () => {
      const token = '123';
      if (!token) {
        return resultError('Invalid token');
      }
      return resultSuccess({
        test: '123123',
      });
    },
  },
  {
    url: '/api/tableList',
    method: 'get',
    response: ({ query }) => {
      const token = '123';
      if (!token) {
        return resultError('Invalid token');
      }
      const { pageNum, pageSize } = query;
      return resultPageSuccess(pageNum, pageSize, demoList('cs'), { message: 'test' });
    },
  },
] as MockMethod[];
