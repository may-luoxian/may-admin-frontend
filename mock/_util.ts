import type { Recordable } from 'vite-plugin-mock';

export enum ResultEnum {
  SUCCESS = 20000,
  ERROR = 40000,
  TIMEOUT = 50000,
  TYPE = 'success',
}

export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: ResultEnum.SUCCESS,
    result,
    message,
    type: 'success',
  };
}

export function resultError(message = 'request failed', { result = null, code = ResultEnum.ERROR } = {}) {
  return {
    code,
    result,
    message,
    type: 'error',
  };
}

export function resultPageSuccess<T = any>(pageNum: number, pageSize: number, list: T[], { message = 'ok' } = {}) {
  const pageData = pagination(pageNum, pageSize, list);
  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  };
}

export function pagination<T = any>(pageNum: number, pageSize: number, list: T[]) {
  const offset = (pageNum - 1) * Number(pageSize);
  if (offset + Number(pageSize) >= list.length) {
    return list.slice(offset, list.length);
  }
  return list.slice(offset, offset + Number(pageSize));
}
