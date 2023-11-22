import TreeUtil from './TreeUtil';

class Verify {
  private treeUtil: TreeUtil //依赖转化树的工具类
  private options: WxTree.TreeOptions = {  // treeOptions的属性
    isTreeConstruct: false,//默认
    treeObjProps: { //默认
      id: 'id',
      title: 'title',
      fatherId: 'fatherId',
      children: 'children'
    }
  }

  private treeObjProps: WxTree.TreeOptions['treeObjProps']

  constructor(options: WxTree.TreeOptions) {
    this.treeUtil = new TreeUtil()
    this.options = options
    this.treeObjProps = options.treeObjProps


  }
  /**
   * 验证传入的list是怎样的结构;
   * 如果list不是树,那么要转为树;
   * 如果list已经是树,就要读取相关属性名的配置.
   * @param list 
   */
  listData(list: object[], editMode: boolean): Array<WxTree.TreeNode> {
    const options = this.options
    let treeList: Array<WxTree.TreeNode> = []

    if (options.isTreeConstruct) { //当前list是树

      treeList = list
    } else { //当前list不是树,需要转化为树


      treeList = this.treeUtil
        .convertToTree(list, this.treeObjProps.id, this.treeObjProps.fatherId, this.treeObjProps.children)
    }

    if (editMode) {
      this.editTreeInit(treeList, options)
    }
    return treeList

  }
  /**
   * 编辑模式做的一些初始化
   * @param treeList 
   * @param options 
   */
  editTreeInit(treeList: WxTree.TreeNode[], options: WxTree.TreeOptions) {
    console.log('--->editMode--->Init', treeList, options)
    const idType = typeof treeList[0][options.treeObjProps.id]
    const idStr = options.treeObjProps.id
    const childrenStr = options.treeObjProps.children || 'children'
    let idValues: (number | string)[] = []

    this.treeUtil.travelTreeForIdValue(treeList, idStr, childrenStr, idValues)
    console.log('idType-->', idType, typeof idType)

    if (idType === "number") {
      idValues.sort((a, b) => (a as number) - (b as number)); //这里报错了怎么办啊?参数“a”和“a” 的类型不兼容。不能将类型“string | number”分配给类型“number”。不能将类型“string”分配给类型“number”。ts(2345)
    }

    console.log('idValues--->', idValues)
  }
}

export default Verify