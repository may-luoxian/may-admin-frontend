/**
 * 树 转 列表
 * 广度优先，先进先出
 * @param {Array} tree 树状数据
 * @param {String} childKey children的key
 */
export function treeToList(tree: any, childKey = 'children') {
  let stack = tree.concat([]);
  let data = [];
  while (stack.length !== 0) {
    // 从stack中拿出来分析
    let shift = stack.shift(); // stack.pop()  先进后出
    data.push(shift);
    let children = shift[childKey];
    if (children) {
      for (let i = 0; i < children.length; i++) {
        // 把数据放入stack中
        stack.push(children[i]);
      }
    }
  }
  return data;
}

// 判断值为空
export function isEmpty(v: any) {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}

// 判断值非空
export function isNotEmpty(v: any) {
  return !isEmpty(v);
}

// 判断字符串是否为JSON
export function isJSON(str: any) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}
