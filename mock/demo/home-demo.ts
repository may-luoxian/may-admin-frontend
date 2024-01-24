import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';
import { uniqueId } from 'lodash-es';

const homeList = (keywords, count: number = 20) => {
  const list = [] as any[];
  for (let index = 0; index < count; index++) {
    list.push({
      name: `${keywords ?? ''}模块${index + 1}`,
      id: uniqueId(),
      widthValue: Math.floor(Math.random() * 4 + 1),
    });
  }
  return list;
};

export default [
  {
    url: '/api/homeList',
    method: 'get',
    response: () => {
      return resultSuccess({
        data: {
          enable: homeList('启用'),
          notEnable: homeList('未启用'),
        },
      });
    },
  },
] as MockMethod[];
