const request = require('../../utils/request');
const mock = require('../../utils/mock');

Page({
  data: {
    categories: mock.categories,
    activeCategory: 'marketing',
    skills: [],
    filteredSkills: []
  },

  onLoad() {
    this.loadSkills();
  },

  loadSkills() {
    request.get('/skills').then(res => {
      const skills = res.data || [];

      this.setData({
        skills
      });

      this.filterSkills(this.data.activeCategory);
    });
  },

  filterSkills(categoryId) {
    const filteredSkills = this.data.skills.filter(item => item.category === categoryId);

    this.setData({
      activeCategory: categoryId,
      filteredSkills
    });
  },

  handleCategoryChange(event) {
    const categoryId = event.currentTarget.dataset.id;
    this.filterSkills(categoryId);
  },

  handleSkillTap(event) {
    const skillId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/skill/skill?skillId=${skillId}`
    });
  },

  handleStart() {
    const firstSkill = this.data.filteredSkills[0] || this.data.skills[0];

    if (!firstSkill) {
      return;
    }

    wx.navigateTo({
      url: `/pages/skill/skill?skillId=${firstSkill.id}`
    });
  }
});
