//logs.js
Page({
    data: {
        collections: [],
        title: '',
        season: ''
    },
    onLoad: function(options) {
        var that = this,
            cateid = options.cateid,
            collectionTypeCode = options.collectionTypeCode.toLowerCase(),
            title = options.title;

        this.setData({
            title: title,
            season: options.collectionTypeCode
        })

        wx.setNavigationBarTitle({
            title: title.toUpperCase()
        })

        wx.request({
          url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getCollectionsList/?id=' + cateid + '&collectionTypeCode=' + collectionTypeCode),
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                var list = [],tmp='';
                res.data.forEach(function(item) {
                  var s = item.name.substr(0,1).toUpperCase()
                    if (tmp == s) {
                        // tmp = item.name.substr(0,1);
                    } else {
                        tmp = s;
                        item.char = tmp;
                    }
                    list.push(item)
                })
                that.setData({
                    collections: list
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
