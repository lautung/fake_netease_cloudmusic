// pages/index/index.js

import myrequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommendList: [],
    topList: []
  },
  onDayRecommendTap(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    let data = await myrequest('/banner', {
      TYPE: 2
    })
    this.setData({
      banners: data.banners,
    })
    let recommendList = await myrequest('/personalized', {
      limit: 10
    })
    this.setData({
      recommendList: recommendList.result,
    })
    let resultArr = [];
    for (let index = 1; index <= 5; index++) {
      let topListData = await myrequest('/top/list', {
        idx: index
      });
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3)
      };
      resultArr.push(topListItem);
      this.setData({
        topList: resultArr
      })
    }
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