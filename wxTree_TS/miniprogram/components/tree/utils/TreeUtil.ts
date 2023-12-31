import _UUID from './UUID'
const UUID = new _UUID(1)



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
   * 非搜索状态下的点击印记
   * @param treeList 
   * @param node 
   * @param idStr 
   * @param childrenStr 
   */
  clickNodeTravel(treeList: Array<WxTree.TreeNode>, node: WxTree.TreeNode, idStr: string, childrenStr: string, searchMode: boolean, searchOnlyRelative: boolean): void {
    for (const item of treeList) {

      if (item[idStr] === node[idStr]) {
        item.isClick = true
        /**
         * 委托recordTrack展示孩子
         */
        if (searchMode && searchOnlyRelative && item[childrenStr]) {
          this.travelNodeForVisible(item, childrenStr)
        }
        if (searchMode == false) {
          return
        }

      } else {
        item.isClick = false
      }

      if (item[childrenStr] && item[childrenStr].length) {
        this.clickNodeTravel(item[childrenStr], node, idStr, childrenStr, searchMode, searchOnlyRelative)
      }
    }



  }

  travelNodeForVisible(node: WxTree.TreeNode, childrenStr: string): void {
    node[childrenStr].forEach((child: WxTree.TreeNode) => {
      child.hidden = false
      if (child[childrenStr]) {
        this.travelNodeForVisible(child, childrenStr)
      }
    })
  }

  /**
   * 
   * @param treeList 
   * @param idStr 
   * @param childrenStr 
   * @param idValues 
   */
  travelTreeForIdValue(treeList: Array<WxTree.TreeNode>, idStr: string, childrenStr: string, idValues: (number | string)[]) {
    for (const item of treeList) {
      idValues.push(item[idStr])
      if (item[childrenStr] && item[childrenStr].length) {
        this.travelTreeForIdValue(item[childrenStr], idStr, childrenStr, idValues)
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


    let results: Array<WxTree.TreeNode> = [] //代表是否有搜索结果

    originTree.forEach(node => {
      node.hidden = true
      this._searchNodeFromTree(node, value, idStr, titleStr, childrenStr, originTree, results)
    })

    if (results.length) {
      return originTree
    } else {
      return results
    }

  }

  /**
   * 
   * @param node 
   * @param value 
   * @param idStr 
   * @param titleStr 
   * @param childrenStr 
   * @param originTree 
   */
  _searchNodeFromTree(node: WxTree.TreeNode, value: string, idStr: string, titleStr: string, childrenStr: string, originTree: WxTree.TreeNode[], results: Array<WxTree.TreeNode>) {

    if (node[titleStr].includes(value)) {
      node.isFound = true
      node.hidden = false
      results.push(node)

      const Ancestors = this.getAncestors(originTree, node, idStr, childrenStr)
 
      Ancestors.forEach((item) => {
        item.openChildren = true
        item.hidden = false
      })
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

  /**
   * 编辑模式添加节点
   * @param treeList 
   * @param node 
   * @param content 
   */
  addNodeOfEdit(treeList: Array<WxTree.TreeNode>,
    node: WxTree.TreeNode,
    idInfo: { idType: string | number; idValues: (string | number)[] },
    treeObjProps: Record<string, any>,
    editType: string,
    content: string) {

    for (let i = 0; i < treeList.length; i++) {
      const current = treeList[i];
 
      if (current.wxTreeId == node.wxTreeId) {
        if (editType == "-1") {
          const newNode: WxTree.TreeNode = {
            ...node,
            [treeObjProps.id]: UUID.generateUniqueId(idInfo),
            wxTreeId: UUID.generateUniqueId(idInfo),
            [treeObjProps.title]: content,
            [treeObjProps.fatherId]: treeObjProps.fatherId,
            isRoot: true
          }
          delete newNode[treeObjProps.children]

          treeList.splice(i + 1, 0, newNode)
        } else {

          current.openChildren = true //展开孩子
          if (!current[treeObjProps.children]) {
            current[treeObjProps.children] = []
          }
          const newNode: WxTree.TreeNode = {
            ...node,
            [treeObjProps.id]: UUID.generateUniqueId(idInfo),
            wxTreeId: UUID.generateUniqueId(idInfo),
            [treeObjProps.title]: content,
            [treeObjProps.fatherId]: treeObjProps.fatherId,
          }
          delete newNode[treeObjProps.children]
          delete newNode.isRoot
          delete newNode.openChildren
          current[treeObjProps.children].push(newNode);
        }
        return

      }

      if (current[treeObjProps.children]) {
        this.addNodeOfEdit(current[treeObjProps.children], node, idInfo, treeObjProps, editType, content)
      }
    }
  }

  /**
   * 从treeList删除某个节点,wxTreeId是对象的唯一标识
   * @param treeList 
   * @param node 
   */
  delNodeOfEdit(treeList: Array<WxTree.TreeNode>, node: WxTree.TreeNode, fatherNode: WxTree.TreeNode | null, treeObjProps: Record<string, any>) {
    for (let i = 0; i < treeList.length; i++) {
      const current = treeList[i]
      if (current[treeObjProps.id] == node[treeObjProps.id]) {
        treeList.splice(i, 1)
        if (fatherNode) {
          if (fatherNode[treeObjProps.children] && fatherNode[treeObjProps.children].length) {

          } else {
            delete fatherNode[treeObjProps.children]
            delete fatherNode.openChildren
          }
        }
        return
      }

      if (current[treeObjProps.children]) {
        this.delNodeOfEdit(current[treeObjProps.children], node, current, treeObjProps)
      }
    }
  }

  /**
   * 修改节点名称
   * @param treeList 
   * @param node 
   * @param treeObjProps 
   */
  updateNodeOfEdit(treeList: Array<WxTree.TreeNode>, node: WxTree.TreeNode,
    treeObjProps: Record<string, any>,
    content: string
  ) {
    for (const current of treeList) {
      if (current[treeObjProps.id] == node[treeObjProps.id]) {
        current[treeObjProps.title] = content
        
        return
      }
      if (current[treeObjProps.children]) {
        this.updateNodeOfEdit(current[treeObjProps.children], node, treeObjProps, content)
      }
    }
  }

  moveNodeforChildren(
    treeList: WxTree.TreeNode[],
    current: WxTree.TreeNode,
    target: WxTree.TreeNode,
    fatherNode: WxTree.TreeNode | null,
    rootTreeList: WxTree.TreeNode[],
    treeObjProps: Record<string, any>
  ) {
    if (current[treeObjProps.id] == target[treeObjProps.id]) { //自己移动到自己
      return
    }
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]
      if (node[treeObjProps.id] == current[treeObjProps.id]) {
        if (fatherNode) {
          fatherNode[treeObjProps.children].splice(i, 1)
          if (fatherNode[treeObjProps.children].length == 0) {
            delete fatherNode[treeObjProps.children]
          }
          this._nodeForChildren(rootTreeList, current, target, treeObjProps)
        } else { //fatherNode为null的情况
          rootTreeList.splice(i, 1) // //treeList先自宫
          this._nodeForChildren(rootTreeList, current, target, treeObjProps)
        }
        return
      }
      if (node[treeObjProps.children]) {
        this.moveNodeforChildren(node[treeObjProps.children], current, target, node, rootTreeList, treeObjProps)
      }


    }
  }
  _nodeForChildren(treeList: WxTree.TreeNode[], current: WxTree.TreeNode, target: WxTree.TreeNode, treeObjProps: Record<string, any>) {
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]
      if (node[treeObjProps.id] == target[treeObjProps.id]) {
        if (node[treeObjProps.children]) {
          node[treeObjProps.children].unshift(current)
        } else {
          node[treeObjProps.children] = []
          node[treeObjProps.children].unshift(current)
        }
        return
      }
      if (node[treeObjProps.children]) {
        this._nodeForChildren(node[treeObjProps.children], current, target, treeObjProps)
      }
    }
  }

  /**
   * 
   * @param treeList 
   * @param current 
   * @param target 
   * @param slot 
   * @param fatherNode 
   * @param treeList 
   * @param treeObjProps 
   */
  moveNodeOfEdit(treeList: WxTree.TreeNode[], current: WxTree.TreeNode, target: WxTree.TreeNode, slot: number, fatherNode: WxTree.TreeNode | null, rootTreeList: WxTree.TreeNode[], treeObjProps: Record<string, any>) {
    if (current[treeObjProps.id] == target[treeObjProps.id]) {
      console.log('= = = = return')
      return
    }
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]
      if (node[treeObjProps.id] == current[treeObjProps.id]) {
        if (fatherNode) {
          console.log('current要自宫...', node, fatherNode)
          fatherNode[treeObjProps.children].splice(i, 1)
          if (fatherNode[treeObjProps.children].length == 0) {
            delete fatherNode[treeObjProps.children]
          }
          this._moveNode(rootTreeList, current, target, null, rootTreeList, slot, treeObjProps)
        } else { //fatherNode为null的分支
          rootTreeList.splice(i, 1) //treeList先自宫
          this._moveNode(rootTreeList, current, target, null, rootTreeList, slot, treeObjProps)
        }
        return
      }

      if (node[treeObjProps.children]) {
        this.moveNodeOfEdit(node[treeObjProps.children], current, target, slot, node, rootTreeList, treeObjProps)
      }
    }
  }
  _moveNode(treeList: WxTree.TreeNode[], current: WxTree.TreeNode,
    target: WxTree.TreeNode, fatherNode: WxTree.TreeNode | null,
    rootTreeList: WxTree.TreeNode[], slot: number, treeObjProps: Record<string, any>) {
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]
      if (node[treeObjProps.id] == target[treeObjProps.id]) {


        if (fatherNode) {
          let insertIndex = i + slot
          fatherNode[treeObjProps.children].splice(insertIndex, 0, current)
        } else { //fatherNode为空null
          let insertIndex = i + slot
          rootTreeList.splice(insertIndex, 0, current)
        }

        return
      }

      if (node[treeObjProps.children]) {
        this._moveNode(node[treeObjProps.children], current, target, node, rootTreeList, slot, treeObjProps)
      }
    }
  }


  /**
   * 
   * @param treeList 
   * @param node 
   * @param treeObjProps 
   */
  moveNodeOfExchange(treeList: Array<WxTree.TreeNode>,
    current: WxTree.TreeNode,
    target: WxTree.TreeNode,
    slot: number,

    fatherNode: WxTree.TreeNode,
    rootTreeList: Array<WxTree.TreeNode>,
    treeObjProps: Record<string, any>
  ) {
    if (current[treeObjProps.id] == target[treeObjProps.id]) {
      console.log('= = = = return')
      return
    }
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]
      if (node[treeObjProps.id] == target[treeObjProps.id]) { //找到了target


        const index = fatherNode[treeObjProps.children].findIndex((item: WxTree.TreeNode) =>
          item[treeObjProps.id] == node[treeObjProps.id])
        console.log('fatherNode->', fatherNode, index, typeof index)
        delete current[treeObjProps.children]
        if (target[treeObjProps.children]) { //如果说目标有children,current的children应该等于目标
          current[treeObjProps.children] = target[treeObjProps.children]
        }
        fatherNode[treeObjProps.children][index] = current

        this._exchangeNode(rootTreeList, current, target, null, rootTreeList, treeObjProps)

        return
      } else {
        if (node[treeObjProps.children]) {
          this.moveNodeOfExchange(node[treeObjProps.children], current, target, slot, node, rootTreeList, treeObjProps)
        }
      }
    }
  }

  /**
   * 辅助moveNodeOfEdit方法,把target换到current的位置处
   * @param rootTreeList 
   * @param current 
   * @param target 
   * @param fatherNode
   * @param rootTreeList 
   */
  _exchangeNode(treeList: WxTree.TreeNode[], current: WxTree.TreeNode,
    target: WxTree.TreeNode, fatherNode: WxTree.TreeNode | null, rootTreeList: WxTree.TreeNode[], treeObjProps: Record<string, any>) {
    for (let i = 0; i < treeList.length; i++) {
      const node = treeList[i]

      if (node[treeObjProps.id] == current[treeObjProps.id]) {
        console.log('finded -->', node, current, target, fatherNode)
        if (fatherNode) { //fatherNode不为null肯定有children
          const index: number = fatherNode[treeObjProps.children].findIndex((item: WxTree.TreeNode) =>
            item[treeObjProps.id] == current[treeObjProps.id]
          )

          const children = node[treeObjProps.children]
          target[treeObjProps.children] = children
          fatherNode[treeObjProps.children][index] = target

        } else { //fatherNode为null
          const index: number = rootTreeList.findIndex((item: WxTree.TreeNode) =>
            item[treeObjProps.id] == current[treeObjProps.id]
          )
          const children = rootTreeList[index][treeObjProps.children]
          target[treeObjProps.children] = children
          console.log('fatherNode为null--->', index, rootTreeList, current)
          rootTreeList[index] = target
        }
        return
      }

      if (node[treeObjProps.children]) {
        this._exchangeNode(node[treeObjProps.children], current, target, node, rootTreeList, treeObjProps)
      }


    }
  }



  /**
   * 确定current是否含有target作为节点:
   * @param current 
   * @param target 
   * 返回:-1代表两个节点相同,0:current包含target;1current不包含target
   */
  _nodeFindTarget(current: WxTree.TreeNode, target: WxTree.TreeNode, treeObjProps: Record<string, any>): boolean {
    if (current[treeObjProps.children]) {
      for (let i = 0; i < current[treeObjProps.children].length; i++) {
        const child = current[treeObjProps.children][i];
        if (child[treeObjProps.id] == target[treeObjProps.id]) { // current的后代包含target
          return true;
        } else {
          if (child[treeObjProps.children]) {
            // 递归调用并返回结果
            if (this._nodeFindTarget(child, target, treeObjProps)) {
              return true;
            }
          }

        }
      }
    }
    return false;
  }

}

export default TreeUtil