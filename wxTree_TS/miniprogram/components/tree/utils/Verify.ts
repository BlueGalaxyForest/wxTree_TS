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
  listData(list: object[]): Array<WxTree.TreeNode> {
    const options = this.options
    if (options.isTreeConstruct) { //当前list是树

      return list
    } else { //当前list不是树,需要转化为树
      return this.treeUtil
        .convertToTree(list, this.treeObjProps.id, this.treeObjProps.fatherId, this.treeObjProps.children)
    }

  }
}

export default Verify