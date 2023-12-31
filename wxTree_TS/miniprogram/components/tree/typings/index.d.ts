declare namespace WxTree {
  type TouchEventWithMark<T> = WechatMiniprogram.TouchEvent | {
    mark?: {
      item?: T;
    };
  };

  interface TreeNode {
    [key: string]: any
    children?: TreeNode[]
  }

  /**
   * TreeOption所有的选项
   */
  interface TreeOptions {
    [key: string]: any;
    isTreeConstruct: boolean,  //给定的数组是否已经就是属性结构,默认:false
    dotBg?: string  //圆点的背景色,#ffffff等十六进制颜色,默认:#808080
    searchBg?: string //搜索状态下,如果搜索成功了,匹配的节点的背景色(#ffffff等十六进制颜色)
    clickBg?: string,  //点击节点的背景颜色(recordTrack设为true的时候起作用)
    recordTrack?: boolean, //是否开启点击印记,true表示开启;默认:false
    searchMode?: boolean,  //是否开启搜索模式,true代表开启;默认false
    searchInputCss?:string,  //在searchMode:true下,设置输入框的样式,如果没有这个配置,没关系会有默认样式
    searchOnlyRelative?:boolean,//在searchMode:true下,设置搜索的节点是否仅仅是父级相关的,默认为false
    editMode?:boolean,  //是否开启编辑节点模式,true代表开启,默认为false
    treeObjProps: {
      id: string,     //tree对象的唯一标识
      title: string,  //树形UI用于展示的文本
      fatherId: string, //树的指针,如{id:1001,name:'文本标题',parentId:2,child:[....]},fatherId在此时取'parentId'
      children?: string //树孩子的名称,例如上行例子,取'child'
    }
  }

}


