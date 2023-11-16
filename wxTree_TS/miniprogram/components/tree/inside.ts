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
    // 切换 显示子项
    toggleShowChildren(e) {
      // console.log('toggleShowChildren()=>', e.mark.item, 'listData==>', this.data.listData)
      const node = e.mark.item
      if (node.hasOwnProperty('openChildren')) {
        this.setData({
          'listData.openChildren': !node.openChildren
        })
        return
      }
      this.setData({
        isShowChildren: !this.data.isShowChildren
      })
      if (node.children) {
        node.children.forEach(item => {
          item.hidden = false
        })
        this.setData({
          listData: node
        })
      }
    },
    cellClick(e) {
      let node = ''
      const flatExpand = this.data.flatExpand

      if (e.type == 'tap') {
        this.triggerEvent('cellClick', e.mark.item)
        // console.log('e.type==tap->', this.data.listData)
        node = e.mark.item
      } else {
        this.triggerEvent('cellClick', e.detail)
        // console.log('e.type==cellClick->', this.data.listData)
        node = e.detail
      }

      // console.log('cellClick()=====>', e.type, e.mark.item, e.detail, flatExpand, node)

      if (e.type == 'tap' && flatExpand && node.children && node.children.length) {
        this.toggleShowChildren({
          mark: {
            item: node
          }
        })
      }


    },

  }
})