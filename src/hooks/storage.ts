import { isEmpty, isJSON } from "@/utils";

interface LooseObject {
  [key: string]: any;
}

export const useStorage = () => {
  /**
   * 添加缓存
   * @param storageType
   * @param key
   * @param value
   */
  function setStorage(storageType: Storage, key: string, value: any) {
    let storageVal = null;
    if (typeof value === "object") {
      storageVal = JSON.stringify(value);
    }
    storageType.setItem(key, value);
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
   * 向指定缓存中添加对象值（缓存中值为对象，若不为对象抛出错误，若缓存不存在，则创建）
   * @param storageType
   * @param key
   * @param stat
   * @param value
   */
  function setObjectStorage(
    storageType: Storage,
    key: string,
    stat: string,
    value: any
  ) {
    let storageVal = storageType.getItem(key) as string;
    if (isJSON(storageVal)) {
      storageVal = JSON.parse(storageVal);
    }
    let obj: LooseObject = {};
    if (
      !isEmpty(storageVal) &&
      Object.prototype.toString.call(storageVal) !== "[object Object]"
    ) {
      throw new Error("该缓存值存在且不为对象");
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
  function removeObjectStorage(
    storageType: Storage,
    key: string,
    stat: string
  ) {
    let storageVal = storageType.getItem(key) as string;
    if (isJSON(storageVal)) {
      storageVal = JSON.parse(storageVal);
    }
    if (
      !isEmpty(storageVal) &&
      Object.prototype.toString.call(storageVal) !== "[object Object]"
    ) {
      throw new Error("该缓存值存在且不为对象");
    }
    let obj = Object.assign(storageVal as unknown as object);
    delete obj[stat];
    storageType.setItem(key, JSON.stringify(obj));
  }
  return {
    setStorage,
    removeStorage,
    setObjectStorage,
    removeObjectStorage,
  };
};
