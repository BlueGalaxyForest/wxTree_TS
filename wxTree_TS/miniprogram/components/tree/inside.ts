// components/tree/inside.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    listData: { //可以是初始的具有指针关系的列表,也可以是树形列表
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

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

      this.setData({
        isShowChildren: !this.data.isShowChildren
      })

    },
    /**
     * 点击节点标题的触发事件
     * @param e 
     */
    nodeClick(e: WechatMiniprogram.Touch): void {
      let node: Record<string, any>
      const flatExpand = this.data.flatExpand

      if (e.type === 'tap') {
        this.triggerEvent('nodeClick', e.mark?.item)
        node = e.mark?.item

      } else {
        this.triggerEvent('nodeClick', e.detail)
        node = e.detail

      }


      if (e.type === 'tap' && flatExpand && node.children && node.children.length) {
        this.toggleShowChildren({
          mark: {
            item: node
          }
        })
      }


    },

  }
})