// 响应数据接口
export interface ResData<T> {
  flag: boolean;
  code: number;
  message: string;
  data: T;
}
