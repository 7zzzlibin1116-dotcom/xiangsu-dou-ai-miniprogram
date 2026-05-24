const favorites = require('../../utils/favorites');

Page({
  data: {
    favorites: [],
    activeType: 'all',
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'record', name: '创作记录' },
      { id: 'inspiration', name: '灵感模板' }
    ]
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const list = favorites.getFavorites();
    const filtered = this.data.activeType === 'all'
      ? list
      : list.filter(item => item.type === this.data.activeType);

    this.setData({
      favorites: filtered.map(item => ({
        ...item,
        typeName: item.type === 'inspiration' ? '灵感' : '记录',
        thumbText: item.type === 'inspiration' ? '灵' : '创',
        actionText: item.type === 'inspiration' ? '点开做相似' : '点开看详情'
      }))
    });
  },

  handleTabTap(event) {
    this.setData({
      activeType: event.currentTarget.dataset.type
    }, () => {
      this.loadFavorites();
    });
  },

  handleFavoriteTap(event) {
    const index = event.currentTarget.dataset.index;
    const item = this.data.favorites[index];

    if (!item) {
      return;
    }

    if (item.type === 'inspiration') {
      wx.navigateTo({
        url: `/pages/skill/skill?templateId=${item.sourceId}`
      });
      return;
    }

    wx.showModal({
      title: item.title,
      content: item.desc || '暂无详情',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  handleRemove(event) {
    const index = event.currentTarget.dataset.index;
    const item = this.data.favorites[index];

    if (!item) {
      return;
    }

    favorites.removeFavorite(item.type, item.sourceId);
    wx.showToast({
      title: '已取消收藏',
      icon: 'none'
    });
    this.loadFavorites();
  },

  goExplore() {
    wx.switchTab({
      url: '/pages/inspiration/inspiration'
    });
  }
});
