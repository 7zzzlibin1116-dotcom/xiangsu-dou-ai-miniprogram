const account = require('./utils/account');

App({
  globalData: {
    appName: '像素豆 AI',
    themeColor: '#FACC15'
  },

  onLaunch() {
    const records = wx.getStorageSync('PIXELDOU_RECORDS');

    if (!Array.isArray(records)) {
      wx.setStorageSync('PIXELDOU_RECORDS', []);
    }

    account.initAccount();
  }
});
