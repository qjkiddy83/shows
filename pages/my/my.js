// pages/my/my.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgH: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://node.jsers.cn/collections/interface/getloved',
      method: "GET",
      data: {
        userid: app.globalData.userInfo.id
      },
      success: function (res) {
        let cacheImgs = res.data.data.map(item => {
          item.faved = JSON.parse(item.fav)
          return item;
        })
        this.setData({
          imgs: cacheImgs.splice(0, 10),
          cacheImgs: cacheImgs
        })
      }.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: function (res) {
        let winW = res.screenWidth;
        let imgH = winW * 960 / 640;
        this.setData({
          screenWidth: res.screenWidth,
          imgH: imgH
        })
      }.bind(this)
    })
  },
  scrolltolower: function () {
    if (!this.data.cacheImgs.length) return;
    this.setData({ 
      imgs: this.data.imgs.concat(this.data.cacheImgs.splice(0, 10)) })
  },
  redirect: function (e) {
    let dataset = e.currentTarget.dataset;
    console.log('../show/show?id=' + dataset.id + '&collectionType=' + dataset.title + '&season=' + dataset.typecollection + '&cname=' + dataset.name)
    // return;
    wx.navigateTo({
      url: '../show/show?id=' + dataset.id + '&collectionType=' + dataset.title + '&season=' + dataset.typecollection + '&cname=' + dataset.name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})