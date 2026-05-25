const request = require('../../utils/request');

Page({
  data: {
    types: ['新增 Skill', '不好用反馈', '商务合作', '模板需求', '其他'],
    type: '新增 Skill',
    content: '',
    contact: ''
  },

  handleTypeTap(event) {
    this.setData({
      type: event.currentTarget.dataset.type
    });
  },

  handleContentInput(event) {
    this.setData({
      content: event.detail.value
    });
  },

  handleContactInput(event) {
    this.setData({
      contact: event.detail.value
    });
  },

  handleSubmit() {
    const content = this.data.content.trim();

    if (!content) {
      wx.showToast({
        title: '先写一点建议内容',
        icon: 'none'
      });
      return;
    }

    request.post('/feedback', {
      type: this.data.type,
      content,
      contact: this.data.contact.trim()
    }).then(() => {
      wx.showModal({
        title: '提交成功',
        content: '谢谢你的建议，我们会优先整理高频需求。',
        showCancel: false,
        confirmText: '知道了'
      });

      this.setData({
        content: '',
        contact: ''
      });
    });
  }
});
