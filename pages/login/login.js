// pages/login/login.js
import myrequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  handleInput(event) {
    console.log("handleInput", event);

    // if (event.currentTarget.id === 'phone') {
    //   this.setData({
    //     inputPhone: event.detail.value
    //   })
    // }
    // if (event.currentTarget.id === 'password') {
    //   this.setData({
    //     inputPassword: event.detail.value
    //   })
    // }
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },
  async login(event) {
    let {
      phone,
      password
    } = this.data
    //验证手机号码
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //正则表达式规则
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    //验证密码
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //请求登录
    wx.showLoading({
      title: '登录中',
    })
    let result = await myrequest('/login/cellphone', {
      phone,
      password,
      isLogin: true
    })
    wx.hideLoading()
    if (result.code === 200) {
      try {
        wx.setStorageSync('userInfo', JSON.stringify(result.profile))
        wx.showToast({
          title: '登录成功',
        })
        wx.reLaunch({
          url: '/pages/user/user',
        })
      } catch (e) {
        console.log(e)
      }

    } else {
      wx.showToast({
        title: '登录失败，请重新登录！',
        icon: 'none'
      })
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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