Page({
  data: {
    version: 'v0.1.0',
    legalItems: [
      {
        type: 'privacy',
        title: '隐私协议'
      },
      {
        type: 'disclaimer',
        title: '免责声明'
      },
      {
        type: 'terms',
        title: '用户协议'
      }
    ]
  },

  handleLegalTap(event) {
    const type = event.currentTarget.dataset.type;

    if (!type) {
      return;
    }

    wx.navigateTo({
      url: `/pages/legal/legal?type=${type}`
    });
  }
});
