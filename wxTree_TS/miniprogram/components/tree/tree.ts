// components/tree/tree.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    treeList: { //具有指针关系的树形列表
      type: Array,
      value: []
    },
    flatExpand: { //点击平级(标题)是否展开节点
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

  }
})