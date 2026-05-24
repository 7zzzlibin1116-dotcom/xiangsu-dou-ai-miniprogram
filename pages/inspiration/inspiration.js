const mock = require('../../utils/mock');
const favorites = require('../../utils/favorites');

Page({
  data: {
    categories: mock.inspirationCategories,
    activeCategory: 'hot',
    inspirations: mock.inspirations,
    filteredInspirations: []
  },

  onLoad() {
    this.filterTemplates(this.data.activeCategory);
  },

  onShow() {
    this.filterTemplates(this.data.activeCategory);
  },

  handleCategoryTap(event) {
    const categoryId = event.currentTarget.dataset.id;
    this.filterTemplates(categoryId);
  },

  filterTemplates(categoryId) {
    const filtered = this.data.inspirations.filter(item => {
      const categoryIds = item.categoryIds || [item.category];
      return categoryIds.indexOf(categoryId) !== -1;
    });
    const filteredInspirations = favorites.markListFavorites(filtered, 'inspiration').map(item => ({
      ...item,
      favoriteText: item.favorited ? '已收藏' : '收藏'
    }));

    this.setData({
      activeCategory: categoryId,
      filteredInspirations
    });
  },

  handleFavoriteTap(event) {
    const index = event.currentTarget.dataset.index;
    const item = this.data.filteredInspirations[index];

    if (!item) {
      return;
    }

    const result = favorites.toggleFavorite({
      type: 'inspiration',
      sourceId: item.id,
      title: item.title,
      desc: `灵感分类：${item.category}`,
      image: '',
      payload: item
    });

    this.setData({
      [`filteredInspirations[${index}].favorited`]: result.favorited,
      [`filteredInspirations[${index}].favoriteText`]: result.favorited ? '已收藏' : '收藏'
    });

    wx.showToast({
      title: result.favorited ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  handleSame(event) {
    const templateId = event.currentTarget.dataset.templateId;

    wx.navigateTo({
      url: `/pages/skill/skill?templateId=${templateId}`
    });
  }
});
