




/**
 * 针对树操作的一些辅助方法
 */
class TreeUtil {



  /**
   * 树形数组转化为 title - 
   * @param {Array<TreeNode>} array 
   * @param {string | number} id 对象文本对应的值 属性字段
   * @param {string | number} fatherId 对象父亲的id 属性字段
   * @param {string} children 是一个标识符,例如[{name:'深圳',child:[....]}]or[{name:'深圳',children:[....]}],此时根据需要
   * 取'child' or 'children' => 但是不是必须传入的,默认是'children'
   */
  convertToTree(array: Array<any>, id: string | number, fatherId: string | number, children: string | undefined): Array<WxTree.TreeNode> {

    const result: Array<WxTree.TreeNode> = [];
    const map: { [key: string]: any } = {};

    array.forEach((item) => {

      item.wxTreeId = item[id]; // 把节点的id做一个统一处理

      map[item[id]] = {
        ...item
      };

      const parent = map[item[fatherId]];
      if (parent) {
        (parent[children ? children : 'children'] || (parent[children ? children : 'children'] = [])).push(map[item[id]]);
      } else {
        result.push(map[item[id]]);
      }
    });

    return result;
  }

  clickNodeTravel(treeList: Array<WxTree.TreeNode>, node: WxTree.TreeNode, idStr: string, childrenStr: string): void {
    for (const item of treeList) {
      console.log('clickNodeTravel-->node', item)

      if (item[idStr] === node[idStr]) {
        item.isClick = true
        return
      }

      if (item[childrenStr] && item[childrenStr].length) {
        this.clickNodeTravel(item[childrenStr], node, idStr, childrenStr)
      }
    }


  }
}

export default TreeUtil