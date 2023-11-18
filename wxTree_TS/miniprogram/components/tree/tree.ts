// components/tree/tree.ts
import _Verify from './utils/Verify'
import _TreeUtil from './utils/TreeUtil'

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
      console.log('listData的监听::', n)
      if (n.length) {
        const Verify = new _Verify(this.data.options as WxTree.TreeOptions)
        const treeList: WxTree.TreeNode = Verify.listData(n)
        console.log('treeList--->', treeList)
        this.setData({
          treeList,
          treeListOrigin: treeList
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    treeList: {} as WxTree.TreeNode, //普通列表转化的树
    treeListOrigin: {} as WxTree.TreeNode  //treeList的拷贝
  },

  /**
   * 组件的方法列表
   */
  methods: {
    nodeClick(e: WechatMiniprogram.Touch) {
      console.log('rootTree=>', this.data.listData)
      this.triggerEvent('nodeClick', e.detail)
      if (this.data.options.recordTrack) { //开启点击印记功能
        const treeUtil = new _TreeUtil()
        const treeListCopy: Array<WxTree.TreeNode> = JSON.parse(JSON.stringify(this.data.treeListOrigin))
        const clickedNode: WxTree.TreeNode = e.detail
        const idStr = this.data.options.treeObjProps.id
        const childrenStr = this.data.options.treeObjProps.children || 'children' //因为childrenStr在非树列表情况下是可选的
        treeUtil.clickNodeTravel(treeListCopy, clickedNode, idStr, childrenStr)

        console.log('点击印记后的treeListCopy::', treeListCopy)
        this.setData({
          treeList: treeListCopy
        })

      }
    }
  }
})