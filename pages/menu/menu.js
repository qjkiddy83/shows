//logs.js
Page({
    data: {
        catelist: [],
        type: ''
    },
    cateItemTap: function(e) {
        var cid = e.currentTarget.dataset.cateid;
        wx.navigateTo({
            url: "../collections/collections?cateid=" + cid + "&collectionTypeCode=" + this.data.type
        })
    },
    onLoad: function(options) {
        var that = this,
            type = options.cate;

        that.setData({
            type: type
        })
        wx.setNavigationBarTitle({
            title: type
        })
        wx.request({
          url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getSeasonList/'),
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                var list = [];

                res.data.forEach(function(item) {
                    var newItem = item;
                    newItem.typename = item.type.replace(/_/g, '-').replace('autumn', "fall");
                    if (newItem.typename.indexOf('fall') > -1) {
                        newItem.yearname = newItem.year + "/" + (parseInt(newItem.year) + 1).toString().substr(2)
                    } else {
                        newItem.yearname = newItem.year;
                    }
                    if (item.collectionCountTypeCode[type.toLowerCase()]) {
                        list.push(newItem)
                    }
                })
                that.setData({
                    catelist: list
                })
            }
        })
    },
    onShareAppMessage:function(){
      return {
        title : "vogue shows",
        url : '/pages/index/index'
      }
    }
})
