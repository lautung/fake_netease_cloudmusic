// pages/video/video.js
import myrequest from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navID: 0,
    videoList: [],
    videoID: '',
    videoSeekList: [], //记录视频播放的seek
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList();
  },
  onSearchTap(event){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  async getVideoGroupList() {
    let videoGroupListData = await myrequest('/video/group/list');
    let videoGroupList = videoGroupListData.data.slice(0, 14)
    let navID = videoGroupList[0].id
    this.setData({
      videoGroupList,
      navID
    })
    //按照标签初始化请求视频列表
    this.getVideoList(this.data.navID)
  },

  async getVideoList(navID) {
    //清空视频列表
    this.setData({
      videoList: []
    })
    let videoListData = await myrequest('/video/group', {
      id: navID
    })

    let index = 0;
    console.log(videoListData);
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList,
      isTriggered: false
    })
    wx.hideLoading()
  },

  changeIndex(event) {
    console.log(event)
    let navID = event.currentTarget.id
    this.setData({
      navID: navID * 1
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getVideoList(this.data.navID);
  },

  //视频进度更新时候调用
  onTimeUpdate(event) {
    console.log(event);
    let videoTImeObj = {
      videoId: event.currentTarget.id,
      currentTime: event.detail.currentTime
    };
    //数组中有数据
    let videoItem = this.data.videoSeekList.find(item => {
      return item.videoId === videoTImeObj.videoId;
    })
    if (videoItem) {
      videoItem.currentTime = videoTImeObj.currentTime;
    } else {
      this.data.videoSeekList.push(videoTImeObj);
    }
    this.setData(() => {
      videoSeekList
    })

  },

  //视频点击播放的时候，包括暂停
  onBindPlay(event) {
    //获取video组件id
    let vid = event.currentTarget.id;
    //关闭上一个视频，不能同时播放
    // this.videoContext && this.videoContext.stop();
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;
    //
    this.setData({
      videoID: vid
    })
    //创建视频实例
    this.videoContext = wx.createVideoContext(vid);
    let videoItem = this.data.videoSeekList.find(item => item.videoId === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
  },

  onEnded(event) {
    console.log(event);
    let {
      videoSeekList
    } = this.data;
    let index = videoSeekList.findIndex(item => item.videoId === event.currentTarget.id)
    videoSeekList.splice(index, 1);
    this.setData({
      videoSeekList
    })
  },

  onRedresherRefresh(event) {
    console.log(event);
    //获取数据
    let {
      navID
    } = this.data;
    this.getVideoList(navID);
  },

  onScrollToLower(event) {
    console.log("上拉触底 => scroll-view => onScrollToLower", event);
    console.log("此处模拟数据而已")
    let {
      videoList
    } = this.data;
    let newVideoList = videoList;
    videoList.push(...newVideoList);
    this.setData({
      videoList
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getVideoGroupList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    console.log(from);
    return {
      title:'自定义标题',
      page:'/pages/video/video',
      imageUrl:'/static/images/nvsheng.jpg'
    }
  }
})