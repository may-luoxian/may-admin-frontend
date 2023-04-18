/**
 * 树 转 列表
 * 广度优先，先进先出
 * @param {Array} tree 树状数据
 * @param {String} childKey children的key
 */
export function treeToList(tree: any, childKey = "children") {
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
