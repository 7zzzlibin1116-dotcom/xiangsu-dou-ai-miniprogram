const request = require('../../utils/request');
const favorites = require('../../utils/favorites');

Page({
  data: {
    records: []
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    request.get('/records').then(res => {
      const records = favorites.markListFavorites(res.data || [], 'record');

      this.setData({
        records: records.map(item => ({
          ...item,
          favoriteText: item.favorited ? '已收藏' : '收藏'
        }))
      });
    });
  },

  handleFavoriteTap(event) {
    const index = event.currentTarget.dataset.index;
    const record = this.data.records[index];

    if (!record) {
      return;
    }

    const result = favorites.toggleFavorite({
      type: 'record',
      sourceId: record.id,
      title: record.skillTitle,
      desc: `时间：${record.createdAt}\n需求：${record.prompt || '未填写'}\n状态：${record.status}`,
      image: record.resultImage || '',
      payload: record
    });

    this.setData({
      [`records[${index}].favorited`]: result.favorited,
      [`records[${index}].favoriteText`]: result.favorited ? '已收藏' : '收藏'
    });

    wx.showToast({
      title: result.favorited ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  handleDeleteTap(event) {
    const index = event.currentTarget.dataset.index;
    const record = this.data.records[index];

    if (!record) {
      return;
    }

    wx.showModal({
      title: '删除记录',
      content: '确定删除这条创作记录吗？',
      confirmText: '删除',
      confirmColor: '#dc2626',
      success: res => {
        if (!res.confirm) {
          return;
        }

        request.post('/records/delete', {
          id: record.id
        }).then(() => {
          favorites.removeFavorite('record', record.id);
          wx.showToast({
            title: '已删除',
            icon: 'none'
          });
          this.loadRecords();
        });
      }
    });
  },

  handleClearAll() {
    if (!this.data.records.length) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '清空记录',
      content: '确定清空全部创作记录吗？此操作不可恢复。',
      confirmText: '清空',
      confirmColor: '#dc2626',
      success: res => {
        if (!res.confirm) {
          return;
        }

        const recordIds = this.data.records.map(item => item.id);

        request.post('/records/clear').then(() => {
          recordIds.forEach(id => {
            favorites.removeFavorite('record', id);
          });

          wx.showToast({
            title: '已清空',
            icon: 'none'
          });
          this.loadRecords();
        });
      }
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
      content: `时间：${record.createdAt}\n结果：${record.resultText || record.prompt || '未填写'}\n状态：${record.status}`,
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
