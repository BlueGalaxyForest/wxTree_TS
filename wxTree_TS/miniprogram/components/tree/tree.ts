// components/tree/tree.ts
import _Verify from './utils/Verify'
import TreeUtil from './utils/TreeUtil'
import {
  debounce
} from './utils/tools'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    listData: { //可以是初始的具有指针关系的列表,也可以是树形列表
      type: Array,
      value: []
    },
    flatExpand: { //点击平级(标题)是否展开节点
      type: Boolean,
      value: true
    },
    isShowChildren: {  //控制树形的节点展开收缩(暂时)
      type: Boolean,
      value: false
    },
    keepAlive: { //保持节点的活跃度(true表示节点的展开状态将会被保留;false表示节点展开状态不会被保留)
      type: Boolean,
      value: true
    },
    options: { //其他配置可选项
      type: Object,
      value: {
        isTreeConstruct: false,
        dotBg: '#808080',
        searchBg: '#00c2a7',
        recordTrack: true,
        treeObjProps: {
          id: 'id',
          title: 'title',
          fatherId: 'fatherId',
          children: 'children'  //针对非树列表,是可选的
        }
      }
    }
  },

  observers: {
    'listData': function (n: Array<WxTree.TreeNode>) {
      console.log('listData listen->', n)

      if (n.length) {
        const Verify = new _Verify(this.data.options as WxTree.TreeOptions)
        const treeList: Array<WxTree.TreeNode> = Verify.listData(n)

        this.setData({
          treeList,
          treeListOrigin: treeList
        })
      }
    },

    'options.editMode': function (n: boolean) {
      console.log('options.editMode listen->', n)
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    treeList: [] as Array<WxTree.TreeNode>, //普通列表转化的树
    treeListOrigin: [] as Array<WxTree.TreeNode>,  //treeList的拷贝

    searchAwake: false, //搜索唤醒的标志,在搜索setData({treeList:xxx})时,用于让后代检测节点相关状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    nodeClick(e: WechatMiniprogram.Touch) {

      this.triggerEvent('nodeClick', e.detail)
      if (this.data.options.recordTrack) { //开启点击印记功能
        this.recordTrack(e.detail)
      }
    },

    /**
     * 具体开启点击印记的逻辑:
     * @param node 被点击的node节点
     */
    recordTrack(node: WxTree.TreeNode) {
      const treeUtil = new TreeUtil()
      const clickedNode: WxTree.TreeNode = node
      const idStr: string = this.data.options.treeObjProps.id
      const childrenStr: string = this.data.options.treeObjProps.children || 'children' //因为childrenStr在非树列表情况下是可选的
      const searchMode: boolean = this.data.options.searchMode
      const searchOnlyRelative:boolean = this.data.options.searchOnlyRelative

      let treeListRecord: Array<WxTree.TreeNode> = [] //根据searchMode来决定追踪哪一颗树
      if (searchMode) {
        treeListRecord = JSON.parse(JSON.stringify(this.data.treeList))
      } else {
        treeListRecord = JSON.parse(JSON.stringify(this.data.treeListOrigin))
      }

      treeUtil.clickNodeTravel(treeListRecord, clickedNode, idStr, childrenStr, searchMode,searchOnlyRelative)

      this.setData({
        treeList: treeListRecord
      })


      setTimeout(() => {
        console.log('recordTrack treeList->', this.data.treeList)
      }, 2000)

    },

    /**
     * 搜索模式的绑定
     * @param e 
     */
    onInput: debounce(async function (this: WechatMiniprogram.Component.TrivialInstance, e: WechatMiniprogram.Input) {

      const inputValue: string = e.detail.value.trim()
      const idStr = this.data.options.treeObjProps.id  //对象的唯一标识
      const titleStr = this.data.options.treeObjProps.title  //对象文本的标识
      const childrenStr = this.data.options.treeObjProps.children || 'children' //children标识,|| 'children' 的原因是在list非树情况下是,这个字段是非必须得,如果不传,默认是'children'
      const treeListOriginCopy = JSON.parse(JSON.stringify(this.data.treeListOrigin))
      const treeUtil = new TreeUtil()
      const results = treeUtil.searchNodeFromTree(inputValue, idStr, titleStr, childrenStr, treeListOriginCopy)

      if (inputValue === '') {
        this.setData({
          isShowChildren: false
        })
      }
      this.setData({
        treeList: results,
        searchAwake: true
      })
      console.log('onInput treeList->', this.data.treeList)

    })


  }
})