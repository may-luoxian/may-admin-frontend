import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RequestOptions, Result, UploadFileParams } from '#/axios';
import { isString } from '@/utils/is';
import { ContentTypeEnum, REQUEST_METHOD_ENUM } from '@/enums/requestEnum';
import { clone } from 'lodash-es';
import { VAxios } from './Axios';
import { deepMerge, setObjToUrlParams } from '@/utils';
import { formatRequestDate, joinTimestamp } from './helper';
import { useStorageHook } from '@/hooks/storage';
const { getToken } = useStorageHook();
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
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData || config.data instanceof URLSearchParams)
        ) {
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
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    return res.data;
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
  requestInterceptorsCatch(error: Error) {},
  /**
   * @description：响应拦截错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: Error) => {
    return Promise.reject(error);
  },
  /**
   * @description 请求失败处理
   */
  // requestCatchHook: () => {},
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
          // 忽略重复请求
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
