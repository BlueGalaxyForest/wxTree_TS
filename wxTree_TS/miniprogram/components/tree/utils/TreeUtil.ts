




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

  /**
   * 点击印记
   * @param treeList 
   * @param node 
   * @param idStr 
   * @param childrenStr 
   */
  clickNodeTravel(treeList: Array<WxTree.TreeNode>, node: WxTree.TreeNode, idStr: string, childrenStr: string): void {
    for (const item of treeList) {
 
      if (item[idStr] === node[idStr]) {
        item.isClick = true
        return
      }

      if (item[childrenStr] && item[childrenStr].length) {
        this.clickNodeTravel(item[childrenStr], node, idStr, childrenStr)
      }
    }


  }
  /**
   * 
   * @param value 搜索的文本
   * @param idStr 对象的标识id,如movieId,cityId等
   * 
   * @param originTree 要搜索的整个树
   */
  searchNodeFromTree(value: string, idStr: string, titleStr: string, childrenStr: string, originTree: Array<WxTree.TreeNode>): Array<WxTree.TreeNode> {
    if (!value) {
      return originTree;
    }
    console.log(value, idStr, titleStr, childrenStr, originTree)

    const results: Array<WxTree.TreeNode> = [] //最终搜索结果
    originTree.forEach(node => {
      node.hidden = true
      this._searchNodeFromTree(node, value, idStr, titleStr, childrenStr, originTree, results)
    })

    return results
  }

  /**
   * 
   * @param node 
   * @param value 
   * @param idStr 
   * @param titleStr 
   * @param childrenStr 
   * @param originTree 
   * @param results 
   */
  _searchNodeFromTree(node: WxTree.TreeNode, value: string, idStr: string, titleStr: string, childrenStr: string, originTree: WxTree.TreeNode[], results: WxTree.TreeNode[]) {
  
    if (node[titleStr].includes(value)) {
      node.isActive = true
      node.hidden = false

      const Ancestors = this.getAncestors(originTree, node, idStr, childrenStr)
      console.log('Ancestors-->', Ancestors)
      if (Ancestors.length) {
        const rootAncestor = Ancestors[0]
        const index = results.findIndex(obj => obj[idStr] == rootAncestor[idStr])
        if (index > -1) {
          Ancestors.forEach(item => {
            item.openChildren = true
            item.hidden = false
          })

        } else {
          Ancestors.forEach(item => {
            item.openChildren = true
            item.hidden = false
          })
          results.push(rootAncestor)
        }
      } else {
        node.isActive = true
        node.hidden = false

        node.openChildren = true
        results.push(node)
      }
    }

    if (node[childrenStr] && node[childrenStr].length) {
      node[childrenStr].forEach((child: WxTree.TreeNode) => {
        child.hidden = true
        this._searchNodeFromTree(child, value, idStr, titleStr, childrenStr, originTree, results)
      })
    }
  }

  /**
   * 获得当前node的所有祖先,不包括自己
   * @param originTree 
   * @param node 
   * @param idStr 
   */
  getAncestors(originTree: WxTree.TreeNode[], node: WxTree.TreeNode, idStr: string, childrenStr: string): Array<WxTree.TreeNode> {
    const ancestors = [];
    let parent = this.getParent(originTree, node, idStr, childrenStr);

    while (parent) {
      ancestors.push(parent)
      parent = this.getParent(originTree, parent, idStr, childrenStr)
    }

    return ancestors.reverse();
  }


  /**
   * 获取当前节点的上一级父亲(一层)
   * @param originTree 
   * @param node 
   * @param idStr 
   */
  getParent(originTree: WxTree.TreeNode[], node: WxTree.TreeNode, idStr: string, childrenStr: string): WxTree.TreeNode | null {
    for (let i = 0; i < originTree.length; i++) {
      const parent = originTree[i]
      if (parent[childrenStr] && parent[childrenStr].find((child: WxTree.TreeNode) => child[idStr] === node[idStr])) {  
        return parent;
      }

      if (parent[childrenStr]) {
        const grandParent = this.getParent(parent[childrenStr], node, idStr, childrenStr)
        if (grandParent) {
          return grandParent
        }
      }
    }

    return null
  }


}

export default TreeUtil