// index.ts
// 获取应用实例


Page({
  data: {


  },

  onLoad() {

  },
  toDetail(e: WechatMiniprogram.Touch) {
    const type: string = e.mark?.item
    if (type === "0") {
      wx.navigateTo({
        url: '/pages/index/show/show'
      })
      return
    }

    if (type === "1") {
      wx.navigateTo({
        url: '/pages/index/search/search'
      })
      return
    }

    if (type === "2") {
      wx.navigateTo({
        url: '/pages/index/edit/edit'
      })
      return
    }
  },

})
