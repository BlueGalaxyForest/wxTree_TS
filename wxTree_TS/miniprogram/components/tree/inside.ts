// components/tree/inside.ts
import TreeUtil from './utils/TreeUtil'
const treeUtil = new TreeUtil()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    treeItem: { //可以是初始的具有指针关系的列表,也可以是树形列表
      type: Object,
      value: {}
    },
    flatExpand: { //点击平级(标题)是否展开节点
      type: Boolean,
      value: true
    },
    isShowChildren: {  //控制树形的节点展开收缩(暂时)
      type: Boolean,
      value: false
    },
    step: {
      type: Number,
      value: 1
    },
    keepAlive: { //保持节点的活跃度(true表示节点的展开状态将会被保留;false表示节点展开状态不会被保留)
      type: Boolean,
      value: true
    },
    options: { //其他配置可选项
      type: Object,
      value: {

      }
    },
    searchAwake: {
      type: Boolean,
      value: true
    },
    editAwake: {
      type: Object,
      value: {} as WxTree.TreeNode
    },
    moveAwake: {
      type: Object,
      value: {} as WxTree.TreeNode
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    id: '',  //节点的id文本名称
    title: '',//是节点的文本名字
    children: '',//孩子的文本名字
    showEditOps: false,// 是否展示编辑的操作
    editType: '',//编辑类型
    editInputText: '',//编辑模式下输入的文本
    placeholder: '请输入内容',
    moveMode: false,   //移动模式
    markMoveBg: false, //用于标记当前移动的是哪个节点
  },
  lifetimes: {
    attached() {
      this.setData({
        id: this.data.options.treeObjProps.id,
        title: this.data.options.treeObjProps.title,
        children: this.data.options.treeObjProps.children || 'children'
      })
    }
  },
  observers: {

    'searchAwake': function (n: boolean) {
      if (!n) return

      const treeItem: WxTree.TreeNode = this.data.treeItem
      const isShowChildren = this.data.isShowChildren
 
      if (isShowChildren && !treeItem.hidden && treeItem[this.data.children]) {

        this.setData({
          isShowChildren: false
        })

      }
    },

    'editAwake': function (n: WxTree.TreeNode) {
      // console.log('son editAwake listen->', n)
      if (JSON.stringify(n) != '{}') {

        if (n[this.data.id] == this.data.treeItem[this.data.id]) {
          this.setData({
            showEditOps: true,
            editType: ''
          })
        } else {


          this.setData({
            showEditOps: false,
            editType: ''
          })
        }

      } else {
        this.setData({
          showEditOps: false
        })
      }
    },

    'moveAwake': function (n: WxTree.TreeNode) {
      
      if (JSON.stringify(n) != '{}') {


        let markMoveBg = this.data.markMoveBg
        const treeItem = this.data.treeItem

        if (n[this.data.id] == treeItem[this.data.id]) {
          markMoveBg = true
        } else {
          markMoveBg = false
        }
        this.setData({
          moveMode: true,
          markMoveBg
        })


      } else {
        this.setData({
          moveMode: false,
          markMoveBg: false,
          showEditOps: false
        })
      }

    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击+,-的触发事件
     * @param e 
     */
    toggleShowChildren<T>(e: WxTree.TouchEventWithMark<T>) {
      const node = e.mark?.item


      if (node.hasOwnProperty('openChildren')) {
        this.setData({
          'treeItem.openChildren': !node.openChildren,
          isShowChildren: !node.openChildren
        })
        return
      }

      this.setData({
        isShowChildren: !this.data.isShowChildren
      })

      /**
       * 解除一些节点的隐藏状态 
       * 如果开启了印记模式,印记帮忙把Children的hidden:false 改为 true;
       * 如果没有开启印记模式,自己去判断做这件事情
       */
      if (this.data.options.searchMode && this.data.options.searchOnlyRelative && !this.data.options.recordTrack && node[this.data.children]) {
        treeUtil.travelNodeForVisible(node, this.data.children)

        this.setData({
          treeItem: node
        })
      }

    },
    /**
     * 点击节点标题的触发事件
     * @param e 
     */
    nodeClick(e: WechatMiniprogram.Touch): void {
      if (this.data.moveMode) {
        this.triggerEvent('moveNode', {
          target: e.mark?.item,
          move: false
        })
        return //移动模式,点击节点,将会把current作为target的儿子
      }

      let node: Record<string, any>
      const flatExpand = this.data.flatExpand

      if (e.type === 'tap') {
        node = e.mark?.item
        this.triggerEvent('nodeClick', e.mark?.item)

      } else {
        node = e.detail
        this.triggerEvent('nodeClick', e.detail)

      }


      if (e.type === 'tap' && flatExpand && node[this.data.children] && node[this.data.children].length) {
        this.toggleShowChildren({
          mark: {
            item: node
          }
        })
      }


    },

    /**
     * 长按节点的触发事件
     * @param e 
     */
    nodeLongPress(e: WechatMiniprogram.Touch) {
      const editMode = this.data.options.editMode
      if (!editMode) return



      if (e.type === 'longpress') {
        this.triggerEvent('nodeLongPress', e.mark?.item)
      } else {
        this.triggerEvent('nodeLongPress', e.detail)
      }

    },

    /**
     * 监听编辑模式
     * @param e 
     */
    onEdit(e: WechatMiniprogram.Touch) {
      const type = e.mark?.type //0添加;1删除;2修改;3移动;4取消
      const node = this.data.treeItem
      const editInputText = this.data.editInputText

   
      switch (type) {
        case "-1":


          this.setData({
            editType: type,
            showEditOps: false,
            placeholder: '请输入根节点名称'
          })
          break;
        case "0":

          this.setData({
            editType: type,
            showEditOps: false,
            placeholder: '请输入子节点名称'

          })

          break;
        case "1":
    
          this.triggerEvent('nodeEdit', { type, node })
          break;
        case "2":
          this.setData({
            editType: type,
            showEditOps: false,
            placeholder: '请输入修改后的节点名称',
            editInputText: node[this.data.title]
          })

          break;
        case "3":
          this.triggerEvent('nodeEdit', { type, node })
          break;
        case "4":
          if (this.data.markMoveBg) {
            console.log('EditType==4,this.data.markMoveBg==', this.data.markMoveBg, type)
            this.triggerEvent('nodeEdit', { type, markMoveBg: true })
          }
          this.setData({
            showEditOps: false,
            markMoveBg: false
          })

          break;
      }
    },
    nodeEdit(e: WechatMiniprogram.Touch) {
      
      this.triggerEvent('nodeEdit', e.detail)
    },

    editOperate(e: WechatMiniprogram.Touch) {
    
      const editType = this.data.editType
      const operType = e.mark?.operType
      const editInputText = this.data.editInputText
      const node = this.data.treeItem

      if ((editType == "-1" || editType == "0" || editType == '2') && operType == '1') {
        this.setData({
          editType: ''
        })
        return
      }

      if ((editType == "-1" || editType == "0" || editType == '2') && operType == "0") { //检测文本不为空
        if (!editInputText) {
          wx.showToast({
            title: '输入内容不能为空',
            icon: 'none',
            duration: 2000
          })
          return
        }

        this.setData({
          editType: '',
          editInputText: ''
        })
        if (editType == '2' && editInputText == node[this.data.title]) { //修改节点,如果文本不变节省效率
          return
        }

        this.triggerEvent('nodeEdit', { type: editType, node, text: editInputText })
      }




    },
    onEditInput(e: WechatMiniprogram.TextareaInput) {
     
      this.setData({
        editInputText: e.detail.value.trim()
      })
    },

    /**
     * 点击移动到某处
     * @param e 
     */
    onMoveClick(e: WechatMiniprogram.Touch) {
  
 
      const target: WxTree.TreeNode = this.data.treeItem
      const slot: number = (Number)(e.mark?.type)
      this.triggerEvent('moveNode', {
        target,
        slot,
        move: true
      })
    },

    moveNode(e: WechatMiniprogram.Touch) {
      this.triggerEvent('moveNode', e.detail)
    }
  }
})