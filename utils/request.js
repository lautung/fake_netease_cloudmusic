import config from './config'
export default (url, data = {}, header = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        // 如果能获取到cookie就使用cookie，若没有返回空字符串
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find((item) => {
          let reg = /MUSIC_U/i;
          return reg.test(item);
        }):''
      },
      success: (res) => {
        if (data.isLogin) {
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })

}