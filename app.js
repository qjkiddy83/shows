//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var app = this;
    wx.getSetting({
      success:function(res){
        if(res.authSetting["scope.userInfo"]){
          this.globalData.authed = true;
          wx.login({
            success: function (lgres) {
              wx.getUserInfo({
                success: function (res) {
                  wx.request({
                    url: 'https://node.jsers.cn/collections/interface/login',
                    method: "POST",
                    data: {
                      code: lgres.code,
                      iv: res.iv,
                      encryptedData: res.encryptedData
                    },
                    success: function (ret) {
                      app.globalData.userInfo = ret.data.data;
                      if(typeof app.loginReadyCallback === "function"){
                        app.loginReadyCallback(ret.data)
                      }
                    }
                  })
                }
              })
            }
          })
        }else{
          this.globalData.authed = false;
        }
      }.bind(this)
    })
  },
  globalData: {
    userInfo: null
  }
})
