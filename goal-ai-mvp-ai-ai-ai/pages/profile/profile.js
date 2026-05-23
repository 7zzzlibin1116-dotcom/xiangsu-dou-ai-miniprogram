const request = require('../../utils/request');

Page({
  data: {
    todayLeft: 20,
    totalCount: 0
  },

  onShow() {
    request.get('/records').then(res => {
      const records = res.data || [];

      this.setData({
        totalCount: records.length,
        todayLeft: Math.max(0, 20 - records.length)
      });
    });
  },

  handleMenuTap(event) {
    wx.showToast({
      title: `${event.currentTarget.dataset.title} 即将上线`,
      icon: 'none'
    });
  },

  handleAbout() {
    wx.showModal({
      title: '关于像素豆 AI',
      content: '像素豆 AI 的使命是：让 AI 使用起来更简单。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
