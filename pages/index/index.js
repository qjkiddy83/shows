//index.js
//获取应用实例
var app = getApp();
var oTouch = {};
var winW = 0;
var imgH = 0;
var tipIndexes = [];
var window_tit = "The Last Fashion Shows";

function getCurTitle(scrollTop) {
  var name = ""
  tipIndexes.forEach(function (o, i) {
    if (o.index * imgH + 30 * (i + 1) < scrollTop) {
      name = o.name;
    }
  })
  if (name == window_tit) {
    return;
  }
  if (!name) {
    name = "The Last Fashion Shows"
  }
  window_tit = name;
  wx.setNavigationBarTitle({
    title: name
  })
}
Page({
  data: {
    cacheImgs: [],
    imgs: [],
    screenWidth: 400,
    imgH: 0,
    layerShow: "none",
    searchIcon: "",
    cates: ["READY-TO-WEAR", "COUTURE", "MENSWEAR", "BRIDAL", "PRE-FALL", "RESORT", "HOME" /*, "DESIGNERS"*/],
    catelist: [],
    authed: false,
    oLoved:{}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  redirect: function (e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../show/show?id=' + dataset.id + '&collectionType=' + dataset.title + '&season=' + dataset.typecollection + '&cname=' + dataset.name
    })
  },
  scrolltolower: function () {
    if (!this.data.cacheImgs.length) return;
    this.setData({ imgs: this.data.imgs.concat(this.data.cacheImgs.splice(0, 10)) })
  },
  dolove: function (dataset) {
    let cate = this.data.imgs[dataset.index];
    wx.request({
      url: 'https://node.jsers.cn/collections/interface/dolove',
      method: "POST",
      data: {
        userid:this.data.userInfo.id,
        favid:dataset.id,
        fav: JSON.stringify(dataset)
      },
      success: function (res) {
        if(res.data){
          let _oloved = this.data.oLoved;
          _oloved[dataset.id] = 1;
          this.setData({
            oLoved:_oloved
          })
        }
      }.bind(this)
    })
  },
  donotLove: function (favid){
    wx.request({
      url: 'https://node.jsers.cn/collections/interface/rmlove',
      method: "POST",
      data: {
        userid: this.data.userInfo.id,
        favid: favid
      },
      success: function (res) {
        if (res.data) {
          let _oloved = this.data.oLoved;
          _oloved[favid] = 0;
          this.setData({
            oLoved: _oloved
          })
        }
      }.bind(this)
    })
  },
  love: function (e) {
    if (this.data.oLoved[e.currentTarget.dataset.id]){//delete love
      this.donotLove(e.currentTarget.dataset.id)
      return;
    }
    if (this.data.userInfo.id) {
      this.dolove(e.currentTarget.dataset);
    } else {
      this.login(function (res) {
        this.dolove(e.currentTarget.dataset);
        this.getloved();
      }.bind(this))
    }
  },
  longpress: function (e) {
    this.dolove(e.currentTarget.dataset);
  },
  scroll: function (e) {
    // getCurTitle(e.detail.scrollTop)
  },
  repTest: function (arr) {
    var tmp = "";
    arr.forEach(function (o, i) {
      o.type = o.type.replace('_', '-');
      o.namecls = Math.random() > 0.5 ? "black" : ""
      if (tmp == o.type + o.typeCollection) {
        o.tip = '';
      } else {
        tmp = o.type + o.typeCollection;
        o.tip = tmp;
        tipIndexes.push({
          index: i,
          name: (o.type + " " + o.year).toUpperCase()
        })
      }
      // console.log(o);
    })
    return arr;
  },
  imageView: function (e) {
    var urls = [];
    this.data.imgs.concat(this.data.cacheImgs).forEach(function (key, i) {
      urls.push(key.images[0])
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.login(function (res) {
        this.setData({
          userInfo:res,
          authed:true
        })
        this.dolove(e.currentTarget.dataset);
        this.getloved();
      }.bind(this))
    }
  },
  login: function (callback) {
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
                console.log(ret)
                app.globalData.userInfo = ret.data.data;
                callback(ret.data.data)
              }
            })
          }
        })
      }
    })
  },
  prevent: function () {

  },
  getloved:function(){
    wx.request({
      url: 'https://node.jsers.cn/collections/interface/getloved',
      method: "GET",
      data: {
        userid: this.data.userInfo.id
      },
      success: function (res) {
        let oLoved = {};
        res.data.data.forEach(item =>{
          oLoved[item.favid] = 1;
        })
        this.setData({
          oLoved:oLoved
        })
      }.bind(this)
    })
  },
  onLoad: function () {
    app.loginReadyCallback = function (userinfo) {
      if (!this.data.userInfo)
        this.setData({
          userInfo: userinfo.data,
          authed:true
        });

      this.getloved();
    }.bind(this)
    this.setData({
      userInfo: app.globalData.userInfo,
      authed: app.globalData.authed
    });
    if (app.globalData.userInfo){
      this.getloved();
    }
    wx.showLoading({
      title: 'loading',
    })
    var that = this
    wx.request({
      url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getLast/?device=iphone&retina=1'),
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        // console.log(res.data)
        var list = that.repTest(res.data);
        // console.log(list)
        that.setData({ cacheImgs: list, imgs: list.splice(0, 10) })
        wx.hideLoading()
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        winW = res.screenWidth;
        imgH = winW * 960 / 640;
        that.setData({
          screenWidth: res.screenWidth,
          imgH: imgH
        })
      }
    })
  },
  onReady: function () {

  },
  onShareAppMessage: function () {
    return {
      title: "Fashion Shows",
      url: '/pages/index/index'
    }
  }
})