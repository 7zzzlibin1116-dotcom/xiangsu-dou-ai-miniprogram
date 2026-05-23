const request = require('../../utils/request');

Page({
  data: {
    records: []
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    request.get('/records').then(res => {
      this.setData({
        records: res.data || []
      });
    });
  },

  handleRecordTap(event) {
    const index = event.currentTarget.dataset.index;
    const record = this.data.records[index];

    if (!record) {
      return;
    }

    wx.showModal({
      title: record.skillTitle,
      content: `时间：${record.createdAt}\n需求：${record.prompt || '未填写'}\n状态：${record.status}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
