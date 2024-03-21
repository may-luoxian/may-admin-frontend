import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RequestOptions, Result, UploadFileParams } from '#/axios';
import { AxiosCanceler } from './axiosCancel';
import { cloneDeep } from 'lodash-es';
import { isFunction } from '@/utils/is';
import qs from 'qs';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import { ContentTypeEnum, REQUEST_METHOD_ENUM } from '@/enums/requestEnum';
export * from './axiosTransform';

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description: 创建Axios实例
   */
  private createAxios(config: CreateAxiosOptions) {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description: 重置Axios配置
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: 设置请求头
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: 配置，注册拦截器
   */
  private setupInterceptors() {
    const {
      axiosInstance,
      options: { transform },
    } = this;
    if (!transform) {
      return;
    }
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;

    const axiosCanceler = new AxiosCanceler();

    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // 取消请求流程
      const requestOptions = (config as unknown as any).requestOptions ?? this.options.requestOptions;
      const ignoreCancelToken = requestOptions?.ignoreCancelToken ?? true;

      !ignoreCancelToken && axiosCanceler.addPending(config);

      // 请求拦截处理
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);

    // 请求拦截错误处理
    requestInterceptorsCatch && isFunction(requestInterceptorsCatch) && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      // 取消请求流程
      res && axiosCanceler.removePending(res.config);
      // 响应拦截处理
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应拦截错误处理
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(axiosInstance, error);
      });
  }

  /**
   * @description: 文件上传
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';
    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data![key]);
      });
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    });
  }

  // 支持 form-data
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === REQUEST_METHOD_ENUM.GET) {
      return config;
    }
    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    };
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    // 如果cancelToken被深拷贝，会导致无法使用cancel方法取消请求
    if (config.cancelToken) {
      conf.cancelToken = config.cancelToken;
    }
    // signal同上
    if (config.signal) {
      conf.signal = config.signal;
    }
    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, transformResponseHook, requestCatchHook } = transform || {};
    // 请求前处理
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // 处理响应数据
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ref = transformResponseHook(res, opt);
              resolve(ref);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((err: Error | AxiosError) => {
          // 处理错误响应数据
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(err, opt));
          }
          reject(err);
        });
    });
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }
}
