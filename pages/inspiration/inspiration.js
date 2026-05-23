const mock = require('../../utils/mock');

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

  handleCategoryTap(event) {
    const categoryId = event.currentTarget.dataset.id;
    this.filterTemplates(categoryId);
  },

  filterTemplates(categoryId) {
    const filteredInspirations = this.data.inspirations.filter(item => {
      const categoryIds = item.categoryIds || [item.category];
      return categoryIds.indexOf(categoryId) !== -1;
    });

    this.setData({
      activeCategory: categoryId,
      filteredInspirations
    });
  },

  handleSame(event) {
    const templateId = event.currentTarget.dataset.templateId;

    wx.navigateTo({
      url: `/pages/skill/skill?templateId=${templateId}`
    });
  }
});
