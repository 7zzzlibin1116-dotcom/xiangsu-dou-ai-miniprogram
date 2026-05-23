const request = require('../../utils/request');
const mock = require('../../utils/mock');
const MARKETING_NOTE_LAST_KEY = 'PIXELDOU_MARKETING_NOTE_FORM';
const MOMENTS_COPY_LAST_KEY = 'PIXELDOU_MOMENTS_COPY_FORM';

const noteStyles = ['种草打卡', '特色菜品', '新店开业', '优惠套餐', '地方特色', '品牌活动', '活动宣传', '自定义'];
const momentsStyles = ['新品预热', '限时优惠', '到店打卡', '私域福利', '节日祝福', '客户见证', '爆款推荐', '活动召集'];
const dianpingCategories = ['入口图', '套餐图', '招牌菜', '新鲜事'];

Page({
  data: {
    skillId: '',
    templateId: '',
    skill: {},
    template: {},
    isImageSkill: false,
    isMarketingNote: false,
    isMarketingFormSkill: false,
    isDianpingImage: false,
    dianpingCategories,
    selectedDianpingCategory: '入口图',
    hasCustomStyle: true,
    marketingStyleLabel: '笔记风格',
    customStylePlaceholder: '请输入自定义笔记风格',
    isTemplateSimilar: false,
    uploadedImage: '',
    prompt: '',
    noteStyles,
    marketingForm: {
      city: '',
      businessArea: '',
      industry: '',
      category: '',
      brandName: '',
      noteStyle: '种草打卡',
      customStyle: '',
      sellingPoints: ''
    },
    generating: false,
    resultImage: ''
  },

  onLoad(options) {
    if (options.templateId) {
      this.loadTemplateSimilar(options.templateId);
      return;
    }

    const skillId = options.skillId || 'marketing-note';

    this.setData({
      skillId
    });

    this.loadSkill(skillId);
  },

  loadTemplateSimilar(templateId) {
    const template = mock.getInspirationById(templateId);

    this.setData({
      templateId,
      skillId: `similar-${templateId}`,
      template,
      skill: {
        id: `similar-${templateId}`,
        title: '做相似',
        description: '上传参考图片，按当前模板生成同款风格。',
        type: 'image',
        icon: 'AI',
        iconImage: '/assets/common/magic-generate.png'
      },
      isImageSkill: true,
      isMarketingNote: false,
      isMarketingFormSkill: false,
      isDianpingImage: false,
      hasCustomStyle: false,
      isTemplateSimilar: true,
      prompt: this.buildTemplatePrompt(template)
    });

    wx.setNavigationBarTitle({
      title: '做相似'
    });
  },

  loadSkill(skillId) {
    request.get(`/skills/${skillId}`).then(res => {
      const skill = res.data || {};
      const isMarketingNote = skillId === 'marketing-note';
      const isMomentsCopy = skillId === 'moments-copy';
      const isMarketingFormSkill = isMarketingNote || isMomentsCopy;
      const isDianpingImage = skillId === 'dianping-image';

      this.setData({
        skill,
        isImageSkill: skill.type === 'image',
        isMarketingNote,
        isMarketingFormSkill,
        isDianpingImage,
        selectedDianpingCategory: dianpingCategories[0],
        hasCustomStyle: !isMomentsCopy,
        noteStyles: isMomentsCopy ? momentsStyles : noteStyles,
        marketingStyleLabel: isMomentsCopy ? '朋友圈风格' : '笔记风格',
        customStylePlaceholder: isMomentsCopy ? '请输入自定义朋友圈风格' : '请输入自定义笔记风格',
        'marketingForm.noteStyle': isMomentsCopy ? momentsStyles[0] : noteStyles[0]
      });

      wx.setNavigationBarTitle({
        title: skill.title || ''
      });
    });
  },

  handleExit() {
    const pages = getCurrentPages();

    if (pages.length > 1) {
      wx.navigateBack();
      return;
    }

    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  handleChooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const file = res.tempFiles && res.tempFiles[0];

        if (!file || !file.tempFilePath) {
          return;
        }

        this.setData({
          uploadedImage: file.tempFilePath
        });
      }
    });
  },

  handlePromptInput(event) {
    this.setData({
      prompt: event.detail.value
    });
  },

  handleMarketingInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`marketingForm.${field}`]: event.detail.value
    });
  },

  handleStyleSelect(event) {
    this.setData({
      'marketingForm.noteStyle': event.currentTarget.dataset.style
    });
  },

  handleDianpingCategorySelect(event) {
    this.setData({
      selectedDianpingCategory: event.currentTarget.dataset.category
    });
  },

  handleFillLastMarketing() {
    const lastForm = wx.getStorageSync(this.getMarketingStorageKey());

    if (!lastForm) {
      wx.showToast({
        title: '暂无上次内容',
        icon: 'none'
      });
      return;
    }

    this.setData({
      marketingForm: {
        ...this.data.marketingForm,
        ...lastForm
      }
    });

    wx.showToast({
      title: '已填入',
      icon: 'success'
    });
  },

  buildMarketingPrompt() {
    const form = this.data.marketingForm;
    const noteStyle = form.noteStyle === '自定义' ? form.customStyle : form.noteStyle;
    const styleLabel = this.data.isMarketingNote ? '笔记风格' : '朋友圈风格';

    return [
      `城市：${form.city || '未填写'}`,
      `商圈：${form.businessArea || '未填写'}`,
      `行业：${form.industry || '未填写'}`,
      `品类：${form.category || '未填写'}`,
      `品牌名称：${form.brandName || '未填写'}`,
      `${styleLabel}：${noteStyle || '未填写'}`,
      `核心卖点：${form.sellingPoints || '未填写'}`
    ].join('\n');
  },

  getMarketingStorageKey() {
    return this.data.skillId === 'moments-copy' ? MOMENTS_COPY_LAST_KEY : MARKETING_NOTE_LAST_KEY;
  },

  buildTemplatePrompt(template) {
    return `按「${template.title || '模板'}」生成同款风格图片，保留参考图主体，增强画面氛围、构图和质感。`;
  },

  buildImagePrompt() {
    if (this.data.isDianpingImage) {
      return [
        `图片分类：${this.data.selectedDianpingCategory}`,
        `需求描述：${this.data.prompt || '生成适合大众点评展示的商家图片'}`
      ].join('\n');
    }

    return this.data.prompt || this.data.skill.defaultPrompt || '';
  },

  validateMarketingForm() {
    const form = this.data.marketingForm;

    if (!this.data.uploadedImage) {
      return '请先上传视觉素材';
    }

    if (!form.brandName.trim()) {
      return '请填写品牌名称';
    }

    if (this.data.hasCustomStyle && form.noteStyle === '自定义' && !form.customStyle.trim()) {
      return '请输入自定义风格';
    }

    if (!form.sellingPoints.trim()) {
      return '请补充核心卖点';
    }

    return '';
  },

  handleGenerate() {
    if (this.data.generating) {
      return;
    }

    if (this.data.isMarketingFormSkill) {
      const message = this.validateMarketingForm();

      if (message) {
        wx.showToast({
          title: message,
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isImageSkill && !this.data.uploadedImage) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }

    const generationPrompt = this.data.isMarketingFormSkill
      ? this.buildMarketingPrompt()
      : (this.data.isTemplateSimilar ? this.buildTemplatePrompt(this.data.template) : this.buildImagePrompt());

    if (!generationPrompt.trim()) {
      wx.showToast({
        title: '请输入需求描述',
        icon: 'none'
      });
      return;
    }

    this.createGenerationTask(generationPrompt);
  },

  createGenerationTask(generationPrompt) {
    this.setData({
      generating: true,
      resultImage: '',
      prompt: generationPrompt
    });

    if (this.data.isMarketingFormSkill) {
      wx.setStorageSync(this.getMarketingStorageKey(), this.data.marketingForm);
    }

    mock.createTask({
      skillId: this.data.skillId,
      prompt: generationPrompt,
      image: this.data.uploadedImage
    }).then(data => {
      setTimeout(() => {
        this.queryLocalTask(data.taskId);
      }, 2000);
    }).catch(() => {
      this.setData({
        generating: false
      });

      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    });
  },

  queryLocalTask(taskId) {
    mock.getTaskStatus(taskId).then(task => {
      this.applyTaskResult(task);
    }).catch(() => {
      this.handleTaskFailed('生成失败，请重试');
    });
  },

  applyTaskResult(task) {
    if (!task || task.status !== 'completed') {
      this.handleTaskFailed('生成失败，请重试');
      return;
    }

    const resultImage = task.resultImage || mock.mockResultImages[0];

    this.setData({
      generating: false,
      resultImage
    });

    this.saveRecord(resultImage);
  },

  handleTaskFailed(title) {
    this.setData({
      generating: false
    });

    wx.showToast({
      title,
      icon: 'none'
    });
  },

  saveRecord(resultImage) {
    mock.saveRecord({
      skillId: this.data.skillId,
      skillTitle: this.data.skill.title,
      prompt: this.data.prompt,
      inputImage: this.data.uploadedImage,
      resultImage
    });
  },

  handleDownload() {
    const imageUrl = this.data.resultImage;

    if (!imageUrl) {
      return;
    }

    wx.showLoading({
      title: '保存中'
    });

    const save = filePath => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          wx.hideLoading();
          wx.showToast({
            title: '已保存',
            icon: 'success'
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '保存失败，请检查相册权限',
            icon: 'none'
          });
        }
      });
    };

    if (/^https?:\/\//.test(imageUrl)) {
      wx.downloadFile({
        url: imageUrl,
        success: res => {
          if (res.statusCode === 200) {
            save(res.tempFilePath);
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '图片下载失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '图片下载失败',
            icon: 'none'
          });
        }
      });
      return;
    }

    save(imageUrl);
  }
});
