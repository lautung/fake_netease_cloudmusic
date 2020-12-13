// pages/user/user.js
import myrequest from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;

Page({

  /**
   * 页面的初始数据
   */

  // bindtouchstart="handleTouchStart"
  // bindtouchmove="handleTouchMove"
  // bindtouchend="handleTouchEnd"
  // style="transform: {{coverTransform}}; transition: {{coveTransition}}"
  data: {
    coverTransform: 'translateY(0rpx)',
    coveTransition: '',
    userInfo: {},
    recentPlayList: []
  },

  handleTouchStart(event) {
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {

    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
      coveTransition: ''
    })

  },
  handleTouchEnd(event) {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'
    })
  },

  toLogin(event) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      //获取播放记录
      this.getUserRecentPlayList(userInfo.userId)
    }
  },

  async getUserRecentPlayList(userId) {
    console.log('getUserRecentPlayList')
    let recentData = await myrequest('/user/record', {
      uid: 350530293,
      type: 0
    })
    let index = 0;
    let recentPlayList = recentData.allData.slice(0, 10).map(item => {
      item.id = index++
      return item;
    });
    this.setData({
      recentPlayList
    })
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
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      //获取播放记录
      this.getUserRecentPlayList(userInfo.userId)
    }
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