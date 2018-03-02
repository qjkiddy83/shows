//index.js
//获取应用实例
var app = getApp();
var oTouch = {};
var winW = 0;
var imgH = 0;
var tipIndexes = [];
var window_tit = "The Last Fashion Shows"

function getCurTitle(scrollTop) {
    var name = ""
    tipIndexes.forEach(function(o, i) {
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
        cates: ["READY-TO-WEAR", "COUTURE", "MENSWEAR", "BRIDAL", "PRE-FALL", "RESORT", "HOME" /*, "DESIGNERS"*/ ],
        catelist: []
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    redirect: function(e) {
        let dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '../show/show?id=' + dataset.id + '&collectionType=' + dataset.title + '&season=' + dataset.typecollection + '&cname=' + dataset.name
        })
    },
    scrolltolower: function() {
        if (!this.data.cacheImgs.length) return;
        this.setData({ imgs: this.data.imgs.concat(this.data.cacheImgs.splice(0, 10)) })
    },
    cateTap: function(e) {
        var that = this,
            type = e.currentTarget.dataset.type;
        if(type == "HOME"){
            wx.reLaunch({
                url: "../index/index"
            })
        }else{
            wx.navigateTo({
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
    scroll: function(e) {
        getCurTitle(e.detail.scrollTop)
    },
    repTest: function(arr) {
        var tmp = "";
        arr.forEach(function(o, i) {
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
    imageView: function(e) {
        var urls = [];
        this.data.imgs.concat(this.data.cacheImgs).forEach(function(key, i) {
            urls.push(key.images[0])
        })
        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    onLoad: function() {
        var that = this
        wx.request({
          url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getLast/?device=iphone&retina=1'),
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res)
                // console.log(res.data)
                var list = that.repTest(res.data);
                // console.log(list)
                that.setData({ cacheImgs: list, imgs: list.splice(0, 10) })
            }
        })
        wx.getSystemInfo({
            success: function(res) {
                winW = res.screenWidth;
                imgH = winW * 960 / 640;
                that.setData({
                    screenWidth: res.screenWidth,
                    imgH: imgH
                })
            }
        })
    },
    onShareAppMessage: function() {
        return {
            title: "vogue shows",
            url: '/pages/index/index'
        }
    }
})