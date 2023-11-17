declare namespace WxTree {
  type TouchEventWithMark<T> = WechatMiniprogram.TouchEvent | {
    mark?: {
      item?: T;
    };
  };
}


interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}
