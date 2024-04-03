import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { isString } from '@/utils/is';
import { ContentTypeEnum, REQUEST_METHOD_ENUM } from '@/enums/requestEnum';
import { clone } from 'lodash-es';
import { VAxios } from './Axios';
import { deepMerge, setObjToUrlParams } from '@/utils';
import { formatRequestDate, joinTimestamp } from './helper';
import { useStorageHook } from '@/hooks/storage';
import { ElNotification } from 'element-plus';
import { useUserStoreWithOut } from '@/stores/modules/user';
import router from '@/router';
const { getToken } = useStorageHook();
const { clearOnlineStorage } = useUserStoreWithOut();

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

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description：请求发送前的处理函数，它能够根据需要修改请求配置
   */
  beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions) => {
    const { joinPrefix, apiUrl, urlPrefix, formatDate, joinTime = true, joinParamsToUrl } = options;
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === REQUEST_METHOD_ENUM.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && (Object.keys(config.data).length > 0 || config.data instanceof FormData || config.data instanceof URLSearchParams)) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },
  /**
   * @description：处理响应数据
   * 40001：用户未登录
   * 40002：重复登录
   * 50000：系统异常
   * 51000：操作失败
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transformResponseHook: (res: AxiosResponse<Result>, _options: RequestOptions) => {
    const resData = res?.data || {};
    if (resData.code && [40001, 40002].includes(resData.code)) {
      ElNotification({
        type: 'error',
        title: 'Error',
        message: resData.message,
      });
      clearOnlineStorage();
      router.push('/login');
    } else if (resData.code && [50000, 51000].includes(resData.code)) {
      ElNotification({
        type: 'error',
        title: 'Error',
        message: resData.message,
      });
      return Promise.reject(resData.message);
    }
    return resData;
  },
  /**
   * @description：请求拦截处理
   */
  requestInterceptors: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions) => {
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken) {
      (config as Recordable).headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
    }
    return config;
  },
  /**
   * @description：响应拦截处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },
  /**
   * @description 请求拦截错误处理
   */
  // requestInterceptorsCatch(error: Error) {},
  /**
   * @description：响应拦截错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: Error) => {
    ElNotification({
      type: 'error',
      title: 'Error',
      message: error.message,
    });
  },
  /**
   * @description 请求失败处理
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestCatchHook: (err, _opt) => {
    return Promise.reject(err);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: import.meta.env.VITE_GLOB_API_URL,
          // 接口拼接地址
          urlPrefix: import.meta.env.VITE_GLOB_API_URL_PREFIX,
          //  是否加入时间戳
          joinTime: true,
          // 是否忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios();
