export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
export type SuccessMessageMode = ErrorMessageMode;

export interface RequestOptions {
  // 是否将请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 是否格式化请求参数时间
  formatDate?: boolean;
  // 是否需要处理请求结果
  isTransformResponse?: boolean;
  // 是否需要返回响应头
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // 接口地址，默认使用apiUrl
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // 错误请求消息类型
  errorMessageMode?: ErrorMessageMode;
  // 成功请求消息类型
  successMessageMode?: SuccessMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // 是否在请求头中加入token
  withToken?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
}

export interface RetryRequest {
  isOpenRetry: boolean;
  count: number;
  waitTime: number;
}
export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

// multipart/form-data: 上传文件
export interface UploadFileParams {
  // 其他参数
  data?: Recordable;
  // 文件参数接口字段名
  name?: string;
  // 文件
  file: File | Blob;
  // 文件名称
  filename?: string;
  [key: string]: any;
}
