// components/menu/menu.js
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
    layerShow:false,
    menushow:false,
    catelist: [],
    type: '',
    cates: ["READY-TO-WEAR", "COUTURE", "MENSWEAR", "BRIDAL", "PRE-FALL", "RESORT", "HOME" /*, "DESIGNERS"*/],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cateItemTap: function (e) {
      var cid = e.currentTarget.dataset.cateid;
      // wx.navigateTo({
      //   url: "../collections/collections?cateid=" + cid + "&collectionTypeCode=" + this.data.type
      // })
      const collectionsComp = this.selectComponent('#collections');
      collectionsComp.show(cid, "title", this.data.type);
    },
    toCollections:function(options){
      let { cateid, title, collectiontypecode} = options.currentTarget.dataset;
      const collectionsComp = this.selectComponent('#collections');
      collectionsComp.show(cateid, title, collectiontypecode);
      this.setData({
        menushow: false
      })
    },
    show:function(type){
      var that = this;

      that.setData({
        menushow:true,
        type: type
      })
      wx.setNavigationBarTitle({
        title: type
      })
      wx.showLoading({
        title: 'loading',
      })
      wx.request({
        url: 'https://www.jsers.cn/collections/?url=' + encodeURIComponent('https://www.vogue.ru/api/AppCollections/1.6/getSeasonList/'),
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var list = [];

          res.data.forEach(function (item) {
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
          wx.hideLoading();
        }
      })
    },
    showSeach: function () {
      console.log('fdsfdsfds')
      var show = "none",
        cls = "",
        menushow = false;
      if (!this.data.searchIcon) {
        show = "block";
        cls = "close";
        menushow = false;
      } else {
        show = "none";
        menushow = false;
        cls = ""
      }
      this.setData({
        menushow: menushow,
        layerShow: show,
        searchIcon: cls,
        catelist:[]
      })
      const collectionsComp = this.selectComponent('#collections');
      collectionsComp.close();
    },
    closeLayer:function(){
      this.setData({
        menushow: false,
        layerShow: "none",
        searchIcon: "",
        catelist: []
      })
    },
    cateTap: function (e) {
      var that = this,
        type = e.currentTarget.dataset.type;
      if (type == "HOME") {
        wx.reLaunch({
          url: "../index/index"
        })
      } else {
        // wx.navigateTo({
        //     url: "../menu/menu?cate=" + type
        // })
        this.show(type)
      }
      this.setData({
        layerShow: "none"
      })
    },
    showMenuComp: function (type) {
      const menuComp = this.selectComponent('#menu-comp');
      menuComp.show(type);
    },
  }
})
