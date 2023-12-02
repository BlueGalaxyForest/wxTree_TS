// pages/index/search/search.ts
import movieList from '../../../datas/movieList' //movieList没有转化为树
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [] as Array<any>,
    treeOptions: {
      searchMode:true, //开启搜索模式
      recordTrack: true, //开启点击印记
      treeObjProps: {      // 这个属性是必须的,目的是描述树结构的配置
      id: 'movieId',//moveList每个对象的唯一标识
      title: 'typeName',//用于展示树节点的文本
      fatherId: 'parentId',//moveList每个对象的指针
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      movieList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})