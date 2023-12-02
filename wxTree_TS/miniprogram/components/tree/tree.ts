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


      if (n.length) {
        const Verify = new _Verify(this.data.options as WxTree.TreeOptions)
        const editMode = this.properties.options.editMode
        const { treeList, idInfo } = Verify.listData(n, editMode)

        this.setData({
          treeList,
          treeListOrigin: treeList,
          idInfo
        })
      }
    },



  },
  lifetimes: {
    attached() {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    treeList: [] as Array<WxTree.TreeNode>, //普通列表转化的树
    treeListOrigin: [] as Array<WxTree.TreeNode>,  //treeList的拷贝

    searchAwake: false, //搜索唤醒的标志,在搜索setData({treeList:xxx})时,用于让后代检测节点相关状态
    editAwake: {} as WxTree.TreeNode,  //编辑模式的唤醒标志
    moveAwake: {} as WxTree.TreeNode,    //编辑模式->移动节点模式的标志唤醒
    idInfo: {} as {
      idType: string | number,
      idValues: (string | number)[];
    } //编辑模式使用到的
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

    nodeLongPress(e: WechatMiniprogram.Touch) {

      this.setData({
        editAwake: e.detail as WxTree.TreeNode
      })
    },
    nodeEdit(e: WechatMiniprogram.Touch) {
      const treeUtil = new TreeUtil()
      const treeList = this.data.treeList
      const type: string = e.detail.type
      const node: WxTree.TreeNode = e.detail.node
      const idInfo = this.data.idInfo
      const treeObjProps: Record<string, any> = this.data.options.treeObjProps
      treeObjProps.children = treeObjProps.children || 'children'




      switch (type) {


        case "-1": //root级别添加
        case "0": //孩子级别添加
          const text = e.detail.text //输入的文本
          const idInfo = this.data.idInfo
          treeUtil.addNodeOfEdit(treeList, node, idInfo, treeObjProps, type, text)
          if (idInfo.idType === 'number') {
            const idValues: number[] = idInfo.idValues as number[]
            idValues.push(idValues[idValues.length - 1] + 1)
            idInfo.idValues = idValues
            this.setData({
              idInfo
            })
          }
         
          this.setData({
            treeList,
            editAwake: {}
          })
          this.triggerEvent('nodeEditResult', treeList)
          break;
        case "1": //删除
          treeUtil.delNodeOfEdit(treeList, node, null, treeObjProps)
          this.setData({
            treeList,
            editAwake: {}
          })
          this.triggerEvent('nodeEditResult', treeList)
          break;
        case "2":

          treeUtil.updateNodeOfEdit(treeList, node, treeObjProps, e.detail.text)
          this.setData({
            treeList,
            editAwake: {}
          })
          this.triggerEvent('nodeEditResult', treeList)
          break;
        case "3":



          // treeUtil.moveNodeOfEdit(treeList,node,treeObjProps)
          this.setData({
            moveAwake: node
          })
          break;
        case "4":
          const markMoveBg = e.detail.markMoveBg
          console.log('cancel--->', markMoveBg)
          if (markMoveBg) {
            this.setData({
              moveAwake: {}
            })
            return
          }

          break;
      }
    },
    /**
     * 具体的要移动的逻辑
     * @param e 
     */
    moveNode(e: WechatMiniprogram.Touch) {
      const treeList = this.data.treeList
      const current = this.data.moveAwake //当前节点
      const target: WxTree.TreeNode = e.detail.target
      const slot: number = e.detail.slot
      const move: boolean = e.detail.move //true标识仅仅移动,false标识作为目标节点的子节点



      const treeUtil = new TreeUtil()
      const treeObjProps: Record<string, any> = this.data.options.treeObjProps
      treeObjProps.children = treeObjProps.children || 'children'

      const exchange = treeUtil._nodeFindTarget(current, target, treeObjProps)


      if (exchange) { //交换节点
        treeUtil.moveNodeOfExchange(treeList, current, target, slot, {}, treeList, treeObjProps)
      } else { //非交换节点
        if (move) {

          treeUtil.moveNodeOfEdit(treeList, current, target, slot, null, treeList, treeObjProps)
        } else {

          treeUtil.moveNodeforChildren(treeList, current, target, null, treeList, treeObjProps)
        }
      }

      this.setData({
        treeList,
        moveAwake: {}
      })
      this.triggerEvent('nodeEditResult', treeList)
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
      const searchOnlyRelative: boolean = this.data.options.searchOnlyRelative

      let treeListRecord: Array<WxTree.TreeNode> = [] //根据searchMode来决定追踪哪一颗树
      if (searchMode) {
        treeListRecord = JSON.parse(JSON.stringify(this.data.treeList))
      } else {
        treeListRecord = JSON.parse(JSON.stringify(this.data.treeListOrigin))
      }

      treeUtil.clickNodeTravel(treeListRecord, clickedNode, idStr, childrenStr, searchMode, searchOnlyRelative)

      this.setData({
        treeList: treeListRecord
      })


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


    }),


  }
})