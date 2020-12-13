// pages/recommendSong/recommendSong.js

import myrequest from '../../utils/request'
import PubSub from 'pubsub-js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '1',
    month: '1',
    recommendList: [],
    myindex: 0
  },

  onMusicItemTap(event) {
    let {
      songdata,
      index
    } = event.currentTarget.dataset;
    //
    this.setData({
      myindex: index
    })
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?songdata=${songdata.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    PubSub.subscribe("SWITCH_MUSIC", (msg, data) => {
      let {
        recommendList,
        myindex
      } = this.data
      console.log(msg, data, recommendList, myindex);
      if (data === "preMusic") {
        if (myindex > 0) {
          myindex--
        }else{
          wx.showToast({
            title: '没有上一首歌了',
            icon:'none'
          })
        }
      } else if (data === "nextMusic") {
        if (myindex < recommendList.length-1) {
          myindex++
        }else{
          wx.showToast({
            title: '没有下一首歌了',
            icon:'none'
          })
        }

      }
      this.setData({
        myindex
      })
      console.log(msg, data, recommendList, myindex);
      let currentMusicId = recommendList[myindex].id
      //
      PubSub.publishSync("SEND_MUSIC_ID", currentMusicId)
    })
    //
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期
    this.setData({
      day: new Date().getDay(),
      month: new Date().getMonth() + 1
    })

    this.getRecommendListData();
  },

  async getRecommendListData() {
    let recommendListData = await myrequest("/recommend/songs");
    this.setData({
      recommendList: recommendListData.recommend
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
    PubSub.unsubscribe("SWITCH_MUSIC");
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