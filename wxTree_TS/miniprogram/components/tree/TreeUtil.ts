




/**
 * 针对树操作的一些辅助方法
 */
class TreeUtil {
  /**
   * 树形数组转化为 title - 
   * @param {Array<TreeNode>} array 
   * @param {string} name 对象的文本 属性字段
   * @param {string | number} id 对象文本对应的值 属性字段
   * @param {string | number} fatherId 对象父亲的id 属性字段
   */
  convertToTree(array: Array<any>, name: string, id: string | number, fatherId: string | number): Array<TreeNode> {

    const result: Array<{ [key: string]: any }> = [];
    const map: { [key: string]: any } = {};

    array.forEach((item) => {
      item.title = item[name]; // 把节点的中文值做一个统一处理
      item.id = item[id]; // 把节点的id做一个统一处理

      map[item[id]] = {
        ...item
      };

      const parent = map[item[fatherId]];
      if (parent) {
        (parent.children || (parent.children = [])).push(map[item[id]]);
      } else {
        result.push(map[item[id]]);
      }
    });

    return result;
  }
}

export default TreeUtil