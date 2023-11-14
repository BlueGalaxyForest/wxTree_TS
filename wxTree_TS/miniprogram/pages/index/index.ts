// index.ts
// 获取应用实例
import cityTree from '../../datas/cityTree'
const app = getApp<IAppOption>()

Page({
  data: {
    
  },

  onLoad() {
    console.log('cityTree==>', cityTree)
    this.setData({

    })
  },

})
