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
    console.log('moveList==>', movieList)
    const movieTree: Array<TreeNode> = treeUtil.convertToTree(movieList, 'typeName', 'movieId', 'parentId')
    console.log('moveTree-->', movieTree)
    this.setData({
      movieTree: movieTree
    })
  },

})
