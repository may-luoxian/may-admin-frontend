import { mergeWith, unionWith, intersectionWith, isEqual } from 'lodash-es';
import { isArray, isObject, isEmpty } from '@/utils/is';

/**
 * 树 转 列表
 * 广度优先，先进先出
 * @param {Array} tree 树状数据
 * @param {String} childKey children的key
 */
export function treeToList(tree: any, childKey = 'children') {
  const stack = tree.concat([]);
  const data = [];
  while (stack.length !== 0) {
    // 从stack中拿出来分析
    const shift = stack.shift(); // stack.pop()  先进后出
    data.push(shift);
    const children = shift[childKey];
    if (children) {
      for (let i = 0; i < children.length; i++) {
        // 把数据放入stack中
        stack.push(children[i]);
      }
    }
  }
  return data;
}

/**
 * 提取树指定结构
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * 提取树指定结构
 */
export function treeMapEach(data: any, { children = 'children', conversion }: { children?: string; conversion: Fn }) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        })
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}
/**
 * 获取树节点路径
 * @param {*} curKey 树节点标识的值
 * @param {array} data 树
 * @returns {array} result 存放搜索到的树节点到顶部节点的路径节点
 */
export function getPathByKey(curKey: any, data: any, stat: string) {
  /** 存放搜索到的树节点到顶部节点的路径节点 */
  let result: any = [];
  /**
   * 路径节点追踪
   * @param {*} curKey 树节点标识的值
   * @param {array} path 存放搜索到的树节点到顶部节点的路径节点
   * @param {*} data 树
   * @returns undefined
   */
  const traverse = (curKey: any, path: any, data: any) => {
    // 树为空时，不执行函数
    if (data.length === 0) {
      return;
    }

    // 遍历存放树的数组
    for (const item of data) {
      // 遍历的数组元素存入path参数数组中
      path.push(item);
      // 如果目的节点的id值等于当前遍历元素的节点id值
      if (item[stat] === curKey) {
        // 把获取到的节点路径数组path赋值到result数组
        result = JSON.parse(JSON.stringify(path));
        return;
      }

      // 当前元素的children是数组
      const children = Array.isArray(item.children) ? item.children : [];
      // 递归遍历子数组内容
      traverse(curKey, path, children);
      // 利用回溯思想，当没有在当前叶树找到目的节点，依次删除存入到的path数组路径
      path.pop();
    }
  };
  traverse(curKey, [], data);
  // 返回找到的树节点路径
  return result;
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(source: T, target: U, mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`);
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}

/**
 * 将对象转换为UrlParams
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * 计算元素位置
 * @param dataList 元素宽度（百分比）列表
 * @param parentEl 父元素节点
 * @param cardH 卡片高度
 * @param scrollWidth 滚动条高度
 * @param gap 间距
 */
export function absoluteElPosition(dataList: any[], parentEl: any, cardH: number, scrollWidth: number = 0, gap: number = 0) {
  if (isEmpty(dataList)) {
    return dataList;
  }
  let top = 0,
    left = 0;
  const pwidth = parentEl.offsetWidth - scrollWidth;
  const oneFourW = (pwidth - gap * 3) / 4;
  const oneThirdW = (pwidth - gap * 2) / 3;
  const halfW = (pwidth - gap) / 2;
  const twoThirdW = (pwidth * 2 - gap) / 3;
  const fullW = pwidth;
  for (let i = 0; i < dataList.length; i++) {
    let childWidth = 0;
    switch (dataList[i].widthValue) {
      case 1:
        childWidth = oneFourW;
        break;
      case 2:
        childWidth = oneThirdW;
        break;
      case 3:
        childWidth = halfW;
        break;
      case 4:
        childWidth = twoThirdW;
        break;
      case 5:
        childWidth = fullW;
        break;
      default:
        childWidth = oneFourW;
        break;
    }
    if (i === 0) {
      dataList[i].top = 0;
      dataList[i].left = 0;
      dataList[i].width = childWidth;
      continue;
    }
    const surPlus = pwidth - (left + dataList[i - 1].width);
    if (childWidth <= surPlus) {
      left += dataList[i - 1].width + gap;
    } else {
      top += cardH + gap;
      left = 0;
    }
    dataList[i].top = top;
    dataList[i].left = left;
    dataList[i].width = childWidth;
  }
  return dataList;
}
