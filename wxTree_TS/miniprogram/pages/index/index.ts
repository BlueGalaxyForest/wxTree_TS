// index.ts
// 获取应用实例
import cityTree from '../../datas/cityTree'
import movieList from '../../datas/movieList'
import productList from '../../datas/products'

import TreeUtil from '../../components/tree/utils/TreeUtil'

const treeUtil = new TreeUtil()
const app = getApp<IAppOption>()

Page({
  data: {
    movieTree: [] as Array<WxTree.TreeNode>,  //树形结构
    movieList: [] as Array<any>, //具有fatherId的数组

    /**如果给定列表不是树,参考这个选项 */
    treeOptions: {
      isTreeConstruct: false, //不是树结构
      recordTrack: true, //记录点击印记
      searchMode: true, //开启搜索模式
      searchBg: 'green',
      // searchInputCss: "--border-color:#DDDDDD;--border-radius:5px;--background-color:#33FFFF;--padding:5px 5px",//输入框的样式设置
      editMode: true,
      searchOnlyRelative: true,
      treeObjProps: {
        id: 'movieId',
        title: 'typeName',
        fatherId: 'parentId',
        children: 'childs'  //这里可以顺便取值,如果不想要这个字段,可以删除,默认值为'children'
      }
    } as WxTree.TreeOptions,

    /**如果给定的列表是树,参考这个选项 */
    treeOptions2: {
      isTreeConstruct: true, //是树结构
      recordTrack: true, //记录点击印记
      dotBg: "#33CCFF",
      // clickBg:"#99FF33", 
      treeObjProps: {
        id: 'cityId',
        title: 'name',
        fatherId: '',  //如果是树,这里传空串就行了
        children: 'children'
      }
    } as WxTree.TreeOptions,

    /**
     * 关于editMode:true
     */
    treeOptions3: {
      editMode:true,
      treeObjProps: {
        id: 'id',
        title: 'name',
        fatherId: 'parentId'
      }
    }
  },

  onLoad() {
    this.setData({
      movieList, cityTree,productList
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
