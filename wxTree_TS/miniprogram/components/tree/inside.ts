// components/tree/inside.ts
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '',//是节点的文本名字
    children: '' //孩子的文本名字
  },
  lifetimes: {
    attached() {
      this.setData({
        title: this.data.options.treeObjProps.title,
        children: this.data.options.treeObjProps.children
      })
    }
  },
  observers: {

    'searchAwake': function (n: boolean) {
      if (!n) return

      const treeItem: WxTree.TreeNode = this.data.treeItem
      const isShowChildren = this.data.isShowChildren
      console.log('searchAwake->', n, treeItem, isShowChildren)
      if (isShowChildren && !treeItem.hidden && treeItem[this.data.children]) {

        this.setData({
          isShowChildren: false
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
       */
      if (this.data.options.searchOnlyRelative && node[this.data.children]) {
        node[this.data.children].forEach((item: WxTree.TreeNode) => {
          item.hidden = false
        })
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

  }
})