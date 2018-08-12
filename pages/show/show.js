//index.js
var querys = {};
let app = getApp();
Page({
    data: {
        imgs: [],
        screenWidth: 400,
        imgH: 0,
        layerShow: "none",
        searchIcon: "",
        cates: ["READY-TO-WEAR", "COUTURE", "MENSWEAR", "BRIDAL", "PRE-FALL", "RESORT","HOME"],
        catelist: [],
        cacheImgs: [],
        oLoved:{}
    },
    cateTap: function(e) {
        var that = this,
            type = e.currentTarget.dataset.type;
        if(type == "HOME"){
            wx.reLaunch({
                url: "../index/index"
            })
        }else{
            wx.reLaunch({
                url: "../menu/menu?cate=" + type
            })
        }
        this.setData({
            layerShow: "none",
            searchIcon: ""
        })
    },
    showSeach: function() {
        var show = "none",
            cls = "";
        if (this.data.layerShow == "none") {
            show = "block";
            cls = "close"
        } else {
            show = "none";
            cls = ""
        }
        this.setData({
            layerShow: show,
            searchIcon: cls
        })
    },
    imageView: function(e) {
        // var urls = [];
        // this.data.imgs.forEach(function(key, i) {
        //     urls.push(key.image)
        // })
        // wx.previewImage({
        //     current: e.currentTarget.dataset.src, // 当前显示图片的http链接
        //     urls: urls // 需要预览的图片http链接列表
        // })
    },
    scrolltolower: function() {
        if (!this.data.cacheImgs.length) return;
        this.setData({ imgs: this.data.imgs.concat(this.data.cacheImgs.splice(0, 10)) })
    },
    getloved: function () {
      wx.request({
        url: 'https://node.jsers.cn/collections/interface/getloved',
        method: "GET",
        data: {
          userid: this.data.userInfo.id
        },
        success: function (res) {
          let oLoved = {};
          res.data.data.forEach(item => {
            oLoved[item.favid] = 1;
          })
          this.setData({
            oLoved: oLoved
          })
        }.bind(this)
      })
    },
    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        this.login(function (res) {
          this.setData({
            userInfo: res,
            authed: true
          })
          this.dolove(e.currentTarget.dataset);
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
    dolove: function (dataset) {
      let cate = this.data.imgs[dataset.index];
      wx.request({
        url: 'https://node.jsers.cn/collections/interface/dolove',
        method: "POST",
        data: {
          userid: this.data.userInfo.id,
          favid: dataset.id,
          fav: JSON.stringify(dataset)
        },
        success: function (res) {
          if (res.data) {
            let _oloved = this.data.oLoved;
            _oloved[dataset.id] = 1;
            this.setData({
              oLoved: _oloved
            })
          }
        }.bind(this)
      })
    },
    love: function (e) {
      if (this.data.oLoved[e.currentTarget.dataset.id]) {//delete love
        this.donotLove(e.currentTarget.dataset.id)
        return;
      }
      if (this.data.userInfo.id) {
        this.dolove(e.currentTarget.dataset);
      } else {
        this.login(function (res) {
          this.dolove(e.currentTarget.dataset);
        }.bind(this))
      }
    },
    donotLove: function (favid) {
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
    onLoad: function(options) {
      console.log(options)
        var that = this;
        app.loginReadyCallback = function (userinfo) {
          if (!this.data.userInfo)
            this.setData({
              userInfo: userinfo.data,
              authed: true
            });

          this.getloved();
        }.bind(this)
        this.setData({
          userInfo: app.globalData.userInfo,
          authed: app.globalData.authed
        });
        if (app.globalData.userInfo) {
          this.getloved();
        }
        querys = options;

        this.setData({
            id:options.id,
            name: decodeURIComponent(options.cname),
            collectionType: decodeURIComponent(options.collectionType),
            season: decodeURIComponent(options.season)
        })
        wx.setNavigationBarTitle({
            title: decodeURIComponent(options.cname)
        })

        wx.request({
          url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getCollection/?id=' + options.id + '&device=iphone&retina=1'),
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                var list = res.data.images;
                that.setData({ cacheImgs: list, imgs: list.splice(0, 10) })
            }
        })
        wx.getSystemInfo({
            success: function(res) {
                var imgH = res.screenWidth * 960 / 640;
                that.setData({
                    screenWidth: res.screenWidth,
                    imgH: imgH
                })
            }
        })
    },
    onShareAppMessage: function() {
        var qstr = [];
        for (var k in querys) {
            qstr.push(k + "=" + querys[k])
        }
        return {
            title: decodeURIComponent([querys['cname'], querys['season'], querys['collectionType']].join(' ').replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
                return $1.toUpperCase() + $2.toLowerCase();
            })),
            url: '/pages/show/show?' + qstr.join("&")
        }
    },
    onUnload: function(){
      let pages = getCurrentPages();
      pages.forEach(page =>{
        if(page.route == "pages/index/index"){
          page.getloved();
        }
      })
    }
})
