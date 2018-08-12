// components/collections.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    collection_show:false,
    collections: [],
    title: '',
    season: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function (cateid, title, collectionTypeCode){
      var that = this,
        collectionTypeCode = collectionTypeCode.toLowerCase();

      this.setData({
        collection_show:true,
        title: title,
        season: collectionTypeCode
      })

      wx.setNavigationBarTitle({
        title: title.toUpperCase()
      })

      wx.showLoading({
        title: 'loading',
      })
      wx.request({
        url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getCollectionsList/?id=' + cateid + '&collectionTypeCode=' + collectionTypeCode),
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var list = [], tmp = '';
          res.data.forEach(function (item) {
            var s = item.name.substr(0, 1).toUpperCase()
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
          wx.hideLoading()
        }
      })
    },
    close:function(){
      this.setData({
        collection_show: false,
        collections:[]
      })
    },
    toShowPage:function(e){
      this.close();
      this.triggerEvent('closelayer')
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  }
})
