// pages/songDetail/songDetail.js
import myrequest from '../../utils/request'
import PubSub from 'pubsub-js'
const moment = require('moment');


//获取全局（app）的实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songdata: {},
    musicUrl: '',
    currentTime: '00:00',
    duration: '00:00',
    currentWidth: 0
  },
  //点击播放、暂停
  onMusicTap(event) {
    let {
      isPlay,
      musicUrl
    } = this.data;
    this.setData({
      isPlay: !isPlay
    })
    this.musicControl(isPlay, this.data.songdata.id, musicUrl)
  },
  //音乐控制
  async musicControl(isPlay, musicId, musicUrl) {
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = 450 * (backgroundAudioManager.currentTime / backgroundAudioManager.duration);
      this.setData({
        currentTime,
        currentWidth
      })
    })
    app.appData.musicId = musicId;
    if (!isPlay) {
      if (!musicUrl) {
        let musicNetUrlData = await myrequest('/song/url', {
          id: musicId
        })
        console.log(musicNetUrlData)
        musicUrl = musicNetUrlData.data[0].url
        this.setData({
          musicUrl
        })
      }
      backgroundAudioManager.src = musicUrl;
      backgroundAudioManager.title = this.data.songdata.name;
      console.log(backgroundAudioManager)
      backgroundAudioManager.play();
    } else {
      backgroundAudioManager.pause();
    }
    //监听音乐暂停和播放
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      });
      app.appData.isMusicPlaying = this.data.isPlay;

    })
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      });
      app.appData.isMusicPlaying = this.data.isPlay;
      app.appData.musicId = musicId;
    });
    backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      });
      app.appData.isMusicPlaying = this.data.isPlay;
    });
    //监听结束切换下一首
   backgroundAudioManager.onEnded(() => {
    this.setData({
      currentWidth: 0,
      currentTime: "00:00",
      duration: '00:00'
    })
    PubSub.publishSync("SWITCH_MUSIC", "nextMusic");

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //
    console.log(options)
    let {
      songdata
    } = options
    if (app.appData.isMusicPlaying && app.appData.musicId == songdata) {
      this.setData({
        isPlay: true
      })
    } else {
      this.setData({
        isPlay: false
      })
    }
    this.getMusicDetailData(songdata);

  },

  async getMusicDetailData(musicId) {
    let songdata = await myrequest('/song/detail', {
      ids: musicId
    })
    let duration = moment(songdata.songs[0].dt).format('mm:ss');
    this.setData({
      songdata: songdata.songs[0],
      duration
    })
    //设置标题
    wx.setNavigationBarTitle({
      title: this.data.songdata.name
    })
  },
  onSwitchMusic(event) {
    PubSub.subscribe("SEND_MUSIC_ID", (msg, musicId) => {
      console.log(msg, musicId);
      this.getMusicDetailData(musicId);
      this.musicControl(false, musicId)
      PubSub.unsubscribe("SEND_MUSIC_ID");
    })
    //
    console.log(event);
    let {
      id
    } = event.currentTarget
    if (id === "preMusic") {
      PubSub.publishSync("SWITCH_MUSIC", "preMusic");
    } else if (id === "nextMusic") {
      PubSub.publishSync("SWITCH_MUSIC", "nextMusic");
    }


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