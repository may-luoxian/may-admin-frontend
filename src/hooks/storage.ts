import { isEmpty, isJSON } from '@/utils';
import { MAY_BLOG_TOKEN } from '@/setting/localeSetting';
import Cookies from 'js-cookie';

interface LooseObject {
  [key: string]: any;
}

export const useStorageHook = () => {
  /**
   * 添加缓存
   * @param storageType
   * @param key
   * @param value
   */
  function setStorage(storageType: Storage, key: string, value: any) {
    let storageVal = null;
    if (typeof value === 'object') {
      storageVal = JSON.stringify(value);
    } else {
      storageVal = value;
    }
    storageType.setItem(key, storageVal);
  }

  /**
   * 删除缓存
   * @param storageType
   * @param key
   */
  function removeStorage(storageType: Storage, key: string) {
    storageType.removeItem(key);
  }

  /**
   * 获取缓存
   * @param storageType
   * @param key
   * @returns
   */
  function getStorage(storageType: Storage, key: string): any {
    let storageVal = storageType.getItem(key);
    if (!storageVal) return null;
    storageVal = JSON.parse(storageVal);
    return storageVal;
  }

  /**
   * 向指定缓存中添加对象值（缓存中值为对象，若不为对象抛出错误，若缓存不存在，则创建）
   * @param storageType
   * @param key
   * @param stat
   * @param value
   */
  function setObjectStorage(storageType: Storage, key: string, stat: string, value: any) {
    let storageVal = storageType.getItem(key) as string;
    if (isJSON(storageVal)) {
      storageVal = JSON.parse(storageVal);
    }
    let obj: LooseObject = {};
    if (!isEmpty(storageVal) && Object.prototype.toString.call(storageVal) !== '[object Object]') {
      throw new Error('该缓存值存在且不为对象');
    }
    if (!isEmpty(storageVal)) {
      obj = Object.assign(storageVal as unknown as object);
    }
    obj[stat] = value;
    storageType.setItem(key, JSON.stringify(obj));
  }

  /**
   * 向指定缓存中删除对象值（缓存中值为对象）
   * @param storageType
   * @param key
   * @param stat
   */
  function removeObjectStorage(storageType: Storage, key: string, stat: string) {
    let storageVal = storageType.getItem(key) as string;
    if (isJSON(storageVal)) {
      storageVal = JSON.parse(storageVal);
    }
    if (!isEmpty(storageVal) && Object.prototype.toString.call(storageVal) !== '[object Object]') {
      throw new Error('该缓存值存在且不为对象');
    }
    if (!storageVal) return;
    const obj = Object.assign(storageVal as unknown as object);
    if (obj) {
      delete obj[stat];
    }
    storageType.setItem(key, JSON.stringify(obj));
  }

  /**
   * 获取指定对象缓存中的属性值
   * @param storageType
   * @param key
   * @param stat
   * @returns
   */
  function getObjectStorage(storageType: Storage, key: string, stat: string): any {
    let storageVal: any = storageType.getItem(key);
    if (!storageVal) return null;
    if (isJSON(storageVal)) {
      storageVal = JSON.parse(storageVal);
    }
    if (Object.prototype.toString.call(storageVal) !== '[object Object]') {
      throw new Error('该缓存值不为对象');
    }
    return storageVal[stat];
  }

  function getToken() {
    return Cookies.get(MAY_BLOG_TOKEN);
  }
  return {
    setStorage,
    removeStorage,
    getStorage,
    setObjectStorage,
    removeObjectStorage,
    getObjectStorage,
    getToken,
  };
};
