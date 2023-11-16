// components/tree/tree.ts
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
    options: { //其他配置可选项
      type: Object,
      value: {
        test: 111
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