//index.js
var querys = {};
Page({
    data: {
        imgs: [],
        screenWidth: 400,
        imgH: 0,
        layerShow: "none",
        searchIcon: "",
        cates: ["READY-TO-WEAR", "COUTURE", "MENSWEAR", "BRIDAL", "PRE-FALL", "RESORT","HOME"],
        catelist: [],
        cacheImgs: []
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
        var urls = [];
        this.data.imgs.forEach(function(key, i) {
            urls.push(key.image)
        })
        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    scrolltolower: function() {
        if (!this.data.cacheImgs.length) return;
        this.setData({ imgs: this.data.imgs.concat(this.data.cacheImgs.splice(0, 10)) })
    },
    onLoad: function(options) {
        var that = this;
        querys = options;

        this.setData({
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
    }
})
