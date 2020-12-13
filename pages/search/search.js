// pages/search/search.js
import myrequest from '../../utils/request'
let isSend = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '搜索歌曲',
    hotList: [],
    searchContent: '',
    searchList: [],
    searchHistoryList: []
  },
  onClearTap(event) {
    wx.showModal({
      title: '提示',
      content: '确认删除历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          let {
            searchHistoryList
          } = this.data;
          searchHistoryList = [];
          wx.setStorageSync('searchHistory', JSON.stringify(searchHistoryList));
          this.setData({
            searchHistoryList
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let history = wx.getStorageSync('searchHistory');
    if (history) {
      this.setData({
        searchHistoryList: JSON.parse(history)
      })
    }
    this.requestDefaultSearch();
    this.requestHotList();
  },
  async requestDefaultSearch() {
    let placeholderContentData = await myrequest('/search/default');
    console.log(placeholderContentData)
    this.setData({
      placeholderContent: placeholderContentData.data.realkeyword
    })
  },
  async requestHotList() {
    let placeholderContentData = await myrequest('/search/hot/detail');
    let hotList = placeholderContentData.data;
    this.setData({
      hotList
    })
  },
  onInput(event) {
    let searchContent = event.detail.value.trim();
    if (!searchContent) {
      this.setData({
        searchList: []
      });
    }
    this.setData({
      searchContent
    });
    this.requestSearch(this.data.searchContent);
  },
  async requestSearch(searchContent) {
    if (!searchContent || isSend) {
      this.setData({
        searchList: []
      })
      return;
    }
    isSend = true;
    // 
    let searchListData = await myrequest("/search", {
      keywords: searchContent,
      limit: 10
    })
    let searchList = searchListData.result.songs
    // 搜索记录存入缓存中
    let {
      searchHistoryList
    } = this.data;
    // 
    let indexof = searchHistoryList.findIndex(item => {
      return item.content === searchContent
    })
    if (indexof !== -1) {
      searchHistoryList.splice(indexof, 1);
    }
    searchHistoryList.unshift({
      content: searchContent,
      id: searchHistoryList.length
    });
    searchHistoryList = searchHistoryList.slice(0, 25);
    wx.setStorageSync('searchHistory', JSON.stringify(searchHistoryList));
    this.setData({
      searchList,
      searchHistoryList
    });

    // 
    // 
    setTimeout(() => {
      isSend = false;
    }, 300)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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