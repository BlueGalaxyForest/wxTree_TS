// index.ts
// 获取应用实例
import cityTree from '../../datas/cityTree'
import movieList from '../../datas/movieList'
import TreeUtil from '../../components/tree/TreeUtil'

const treeUtil = new TreeUtil()
const app = getApp<IAppOption>()

Page({
  data: {
    movieTree: [] as Array<TreeNode>
  },

  onLoad() {
    const movieTree: Array<TreeNode> = treeUtil.convertToTree(movieList, 'typeName', 'movieId', 'parentId')
    console.log('moveTree-->', movieTree)
    this.setData({
      movieTree: movieTree
    })
  },

  /**
   * wxTree组件触发父页面钩子
   * @param e 
   */
  nodeClick(e: WechatMiniprogram.Touch) {
    const node = e.detail
    console.log('选择的节点:', node)
  }
})
