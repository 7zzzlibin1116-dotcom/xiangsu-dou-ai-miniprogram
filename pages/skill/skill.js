const request = require('../../utils/request');
const mock = require('../../utils/mock');
const MARKETING_NOTE_LAST_KEY = 'PIXELDOU_MARKETING_NOTE_FORM';
const MOMENTS_COPY_LAST_KEY = 'PIXELDOU_MOMENTS_COPY_FORM';

const noteStyles = ['种草打卡', '特色菜品', '新店开业', '优惠套餐', '地方特色', '品牌活动', '活动宣传', '自定义'];
const momentsStyles = ['新品预热', '限时优惠', '到店打卡', '私域福利', '节日祝福', '客户见证', '爆款推荐', '自定义'];
const communityStyles = ['社群欢迎语', '活动预热', '秒杀通知', '福利提醒', '互动话题', '复购户数', '用户唤醒', '自定义'];
const travelStyles = ['美食', '拍照打卡', '自然风景', '历史文化', '小众路线', '轻松不累', '特种兵暴走', '亲子友好', '夜生活', '购物', '博物馆', '咖啡甜品', '本地市井', '自定义'];
const highEqScenarios = ['领导消息怎么回', '客户消息怎么回', '朋友阴阳怪气怎么回', '对象生气怎么回', '不想去聚会怎么回', '拒绝别人怎么说', '催别人还钱怎么说', '道歉怎么说', '感谢怎么说', '安慰别人怎么说'];
const idPhotoOptions = ['白底证件照', '蓝底证件照', '红底证件照', '一寸照', '二寸照', '简历头像', '职业形象照'];
const resumeDirections = ['更专业', '更有数据感', '更适合大厂', '更适合销售岗位', '更适合运营岗位', '更突出 AI 能力', '更简洁', '更有结果导向'];
const productTypes = ['餐饮菜品', '门店套餐', '美妆护肤', '服装穿搭', '食品饮料', '数码产品', '家居用品', '教育课程', 'AI工具', '本地服务', '电商商品', '其他'];
const oldPhotoNeeds = ['变清晰', '去划痕', '去污渍', '修复破损', '修复褪色', '黑白上色', '保留年代感'];
const oldPhotoLevels = ['轻度修复', '标准修复', '深度修复'];
const oldPhotoLooks = ['严格保持原貌', '自然优化', '轻微美化'];
const dianpingCategories = ['入口图', '套餐图', '招牌菜', '新鲜事'];
const unavailableSkillIds = [];
const dianpingRatioMap = {
  '入口图': '1:1',
  '套餐图': '16:9',
  '招牌菜': '4:3',
  '新鲜事': '4:3'
};
const imageRatios = ['3:4', '4:3', '1:1', '16:9', '9:16'];

Page({
  data: {
    skillId: '',
    templateId: '',
    skill: {},
    template: {},
    isImageSkill: false,
    isMarketingNote: false,
    isMarketingFormSkill: false,
    isHolidayCampaign: false,
    isHotspotTracker: false,
    isCommunityBroadcast: false,
    isTravelPlan: false,
    isRecipeHelper: false,
    isTryOn: false,
    isHighEqReply: false,
    isIdPhoto: false,
    isResumePolish: false,
    isSellingPoints: false,
    isOldPhotoRestore: false,
    isMockupRender: false,
    isUnavailableSkill: false,
    isDianpingImage: false,
    dianpingCategories,
    selectedDianpingCategory: '入口图',
    hasCustomStyle: true,
    marketingStyleLabel: '笔记风格',
    customStylePlaceholder: '请输入自定义笔记风格',
    isTemplateSimilar: false,
    imageRatios,
    selectedImageRatio: '3:4',
    uploadedImage: '',
    uploadedImages: [],
    tryOnImages: {
      clothing: [],
      person: []
    },
    mockupSceneImages: [],
    prompt: '',
    noteStyles,
    travelStyles,
    highEqScenarios,
    idPhotoOptions,
    resumeDirections,
    productTypes,
    oldPhotoNeeds,
    oldPhotoLevels,
    oldPhotoLooks,
    marketingForm: {
      city: '',
      businessArea: '',
      industry: '',
      category: '',
      brandName: '',
      festival: '',
      noteStyle: '种草打卡',
      customStyle: '',
      sellingPoints: ''
    },
    travelForm: {
      destination: '',
      departure: '',
      days: '',
      budget: '',
      companions: '',
      style: '美食',
      customStyle: ''
    },
    recipeForm: {
      meat: '',
      vegetables: '',
      eggDairy: '',
      staple: '',
      people: '',
      dishes: '',
      cookingTime: '',
      taste: '',
      tools: '',
      taboo: ''
    },
    highEqForm: {
      scenario: '领导消息怎么回',
      message: ''
    },
    idPhotoForm: {
      option: '白底证件照'
    },
    resumeForm: {
      experience: '',
      targetRole: '',
      direction: '更专业'
    },
    productForm: {
      name: '',
      type: '餐饮菜品',
      customType: '',
      intro: '',
      price: ''
    },
    oldPhotoForm: {
      needs: ['变清晰'],
      level: '标准修复',
      look: '自然优化'
    },
    mockupForm: {
      materialDesc: '',
      sceneDesc: ''
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
        description: '上传参考图片，生成同款风格。',
        type: 'image',
        icon: 'AI',
        iconImage: '/assets/common/magic-generate.png'
      },
      isImageSkill: true,
      isMarketingNote: false,
      isMarketingFormSkill: false,
      isHolidayCampaign: false,
      isHotspotTracker: false,
      isCommunityBroadcast: false,
      isTravelPlan: false,
      isRecipeHelper: false,
      isTryOn: false,
      isHighEqReply: false,
      isIdPhoto: false,
      isResumePolish: false,
      isSellingPoints: false,
      isOldPhotoRestore: false,
      isMockupRender: false,
      isUnavailableSkill: false,
      isDianpingImage: false,
      hasCustomStyle: false,
      isTemplateSimilar: true,
      selectedImageRatio: imageRatios[0],
      uploadedImage: '',
      uploadedImages: [],
      tryOnImages: {
        clothing: [],
        person: []
      },
      mockupSceneImages: [],
      mockupForm: {
        materialDesc: '',
        sceneDesc: ''
      },
      resultImage: '',
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
      const isHolidayCampaign = skillId === 'holiday-campaign';
      const isHotspotTracker = skillId === 'hotspot-tracker';
      const isCommunityBroadcast = skillId === 'community-broadcast';
      const isTravelPlan = skillId === 'travel-plan';
      const isRecipeHelper = skillId === 'recipe-helper';
      const isTryOn = skillId === 'try-on';
      const isHighEqReply = skillId === 'high-eq-reply';
      const isIdPhoto = skillId === 'id-photo';
      const isResumePolish = skillId === 'resume-polish';
      const isSellingPoints = skillId === 'selling-points';
      const isOldPhotoRestore = skillId === 'old-photo-restore';
      const isMockupRender = skillId === 'mockup-render';
      const isUnavailableSkill = unavailableSkillIds.includes(skillId);
      const isDianpingImage = skillId === 'dianping-image';
      const currentStyles = isMomentsCopy ? momentsStyles : (isCommunityBroadcast ? communityStyles : noteStyles);

      this.setData({
        skill,
        isImageSkill: skill.type === 'image',
        isMarketingNote,
        isMarketingFormSkill,
        isHolidayCampaign,
        isHotspotTracker,
        isCommunityBroadcast,
        isTravelPlan,
        isRecipeHelper,
        isTryOn,
        isHighEqReply,
        isIdPhoto,
        isResumePolish,
        isSellingPoints,
        isOldPhotoRestore,
        isMockupRender,
        isUnavailableSkill,
        isDianpingImage,
        selectedDianpingCategory: dianpingCategories[0],
        hasCustomStyle: true,
        noteStyles: currentStyles,
        marketingStyleLabel: isMomentsCopy ? '朋友圈风格' : '笔记风格',
        customStylePlaceholder: isCommunityBroadcast
          ? '请输入自定义群发风格'
          : (isMomentsCopy ? '请输入自定义朋友圈风格' : '请输入自定义笔记风格'),
        selectedImageRatio: isDianpingImage ? dianpingRatioMap[dianpingCategories[0]] : imageRatios[0],
        uploadedImage: '',
        uploadedImages: [],
        tryOnImages: {
          clothing: [],
          person: []
        },
        mockupSceneImages: [],
        mockupForm: {
          materialDesc: '',
          sceneDesc: ''
        },
        resultImage: '',
        prompt: '',
        'marketingForm.noteStyle': currentStyles[0],
        'travelForm.style': travelStyles[0],
        'highEqForm.scenario': highEqScenarios[0],
        'idPhotoForm.option': idPhotoOptions[0],
        'resumeForm.direction': resumeDirections[0],
        'productForm.type': productTypes[0],
        'oldPhotoForm.needs': [oldPhotoNeeds[0]],
        'oldPhotoForm.level': oldPhotoLevels[1],
        'oldPhotoForm.look': oldPhotoLooks[1]
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
    const maxUploadCount = this.data.skill.maxUploadCount || 9;
    const currentImages = maxUploadCount === 1 ? [] : (this.data.uploadedImages || []);

    if (maxUploadCount > 1 && currentImages.length >= maxUploadCount) {
      wx.showToast({
        title: `最多上传${maxUploadCount}张图片`,
        icon: 'none'
      });
      return;
    }

    const remainCount = maxUploadCount === 1 ? 1 : Math.max(1, maxUploadCount - currentImages.length);

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const files = (res.tempFiles || [])
          .map(file => file.tempFilePath)
          .filter(Boolean);

        if (!files.length) {
          return;
        }

        const uploadedImages = maxUploadCount === 1
          ? files.slice(0, 1)
          : currentImages.concat(files).slice(0, maxUploadCount);

        this.setData({
          uploadedImage: uploadedImages[0] || '',
          uploadedImages
        });
      }
    });
  },

  handleChooseTryOnImage(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    const currentImages = this.data.tryOnImages[field] || [];

    if (currentImages.length >= 9) {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return;
    }

    const remainCount = Math.max(1, 9 - currentImages.length);

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const files = (res.tempFiles || [])
          .map(file => file.tempFilePath)
          .filter(Boolean);

        if (!files.length) {
          return;
        }

        const nextImages = currentImages.concat(files).slice(0, 9);

        this.setData({
          [`tryOnImages.${field}`]: nextImages
        });
      }
    });
  },

  handleChooseMockupSceneImage() {
    const currentImages = this.data.mockupSceneImages || [];

    if (currentImages.length >= 9) {
      wx.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return;
    }

    const remainCount = Math.max(1, 9 - currentImages.length);

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const files = (res.tempFiles || [])
          .map(file => file.tempFilePath)
          .filter(Boolean);

        if (!files.length) {
          return;
        }

        this.setData({
          mockupSceneImages: currentImages.concat(files).slice(0, 9)
        });
      }
    });
  },

  getFirstInputImage() {
    const uploadedImages = this.data.uploadedImages || [];
    const sceneImages = this.data.mockupSceneImages || [];
    const clothingImages = this.data.tryOnImages.clothing || [];
    const personImages = this.data.tryOnImages.person || [];

    return uploadedImages[0] || sceneImages[0] || personImages[0] || clothingImages[0] || '';
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

  handleMockupInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`mockupForm.${field}`]: event.detail.value
    });
  },

  handleTravelInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`travelForm.${field}`]: event.detail.value
    });
  },

  handleRecipeInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`recipeForm.${field}`]: event.detail.value
    });
  },

  handleHighEqInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`highEqForm.${field}`]: event.detail.value
    });
  },

  handleResumeInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`resumeForm.${field}`]: event.detail.value
    });
  },

  handleProductInput(event) {
    const field = event.currentTarget.dataset.field;

    if (!field) {
      return;
    }

    this.setData({
      [`productForm.${field}`]: event.detail.value
    });
  },

  handleStyleSelect(event) {
    this.setData({
      'marketingForm.noteStyle': event.currentTarget.dataset.style
    });
  },

  handleTravelStyleSelect(event) {
    this.setData({
      'travelForm.style': event.currentTarget.dataset.style
    });
  },

  handleHighEqScenarioSelect(event) {
    this.setData({
      'highEqForm.scenario': event.currentTarget.dataset.scenario
    });
  },

  handleIdPhotoOptionSelect(event) {
    this.setData({
      'idPhotoForm.option': event.currentTarget.dataset.option
    });
  },

  handleResumeDirectionSelect(event) {
    this.setData({
      'resumeForm.direction': event.currentTarget.dataset.direction
    });
  },

  handleProductTypeSelect(event) {
    this.setData({
      'productForm.type': event.currentTarget.dataset.type
    });
  },

  handleOldPhotoNeedToggle(event) {
    const need = event.currentTarget.dataset.need;
    const current = this.data.oldPhotoForm.needs || [];
    const next = current.includes(need)
      ? current.filter(item => item !== need)
      : current.concat(need);

    this.setData({
      'oldPhotoForm.needs': next
    });
  },

  handleOldPhotoLevelSelect(event) {
    this.setData({
      'oldPhotoForm.level': event.currentTarget.dataset.level
    });
  },

  handleOldPhotoLookSelect(event) {
    this.setData({
      'oldPhotoForm.look': event.currentTarget.dataset.look
    });
  },

  handleDianpingCategorySelect(event) {
    const category = event.currentTarget.dataset.category;

    this.setData({
      selectedDianpingCategory: category,
      selectedImageRatio: dianpingRatioMap[category] || this.data.selectedImageRatio
    });
  },

  handleRatioSelect(event) {
    this.setData({
      selectedImageRatio: event.currentTarget.dataset.ratio
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
      `图片比例：${this.data.selectedImageRatio}`,
      `${styleLabel}：${noteStyle || '未填写'}`,
      `核心卖点：${form.sellingPoints || '未填写'}`
    ].join('\n');
  },

  getMarketingStorageKey() {
    return this.data.skillId === 'moments-copy' ? MOMENTS_COPY_LAST_KEY : MARKETING_NOTE_LAST_KEY;
  },

  buildTemplatePrompt(template) {
    return [
      `按「${template.title || '模板'}」生成同款风格图片`,
      `图片比例：${this.data.selectedImageRatio}`,
      '保留参考图主体，增强画面氛围、构图和质感。'
    ].join('\n');
  },

  buildImagePrompt() {
    if (this.data.isOldPhotoRestore) {
      const form = this.data.oldPhotoForm;

      return [
        `修复需求：${form.needs.length ? form.needs.join('、') : '未选择'}`,
        `修复程度：${form.level || '未选择'}`,
        `是否保持原貌：${form.look || '未选择'}`,
        `补充需求：${this.data.prompt || '修复老照片，让照片更清晰自然'}`
      ].join('\n');
    }

    if (this.data.isSellingPoints) {
      const form = this.data.productForm;
      const productType = form.type === '其他' ? form.customType : form.type;

      return [
        `产品名称：${form.name || '未填写'}`,
        `产品类型：${productType || '未填写'}`,
        `产品基础介绍：${form.intro || '未填写'}`,
        `产品价格/价格区间：${form.price || '未填写'}`,
        `产品图片/包装图/详情页图：${this.data.uploadedImages.length ? `已上传${this.data.uploadedImages.length}张` : '未上传'}`,
        `补充需求：${this.data.prompt || '提炼清晰可传播的核心卖点'}`
      ].join('\n');
    }

    if (this.data.isResumePolish) {
      const form = this.data.resumeForm;

      return [
        '页面标题：优化一段经历',
        '目标：把普通描述改成更适合写进简历的表达',
        `原始经历：${form.experience || '未填写'}`,
        `目标岗位：${form.targetRole || '未填写'}`,
        `优化方向：${form.direction || '未选择'}`
      ].join('\n');
    }

    if (this.data.isIdPhoto) {
      return [
        `证件照类型：${this.data.idPhotoForm.option || '未选择'}`,
        `补充需求：${this.data.prompt || '生成自然清晰、适合正式使用的证件照'}`
      ].join('\n');
    }

    if (this.data.isTryOn) {
      return [
        '任务：根据衣服照片和用户本人照片生成试穿效果图',
        `衣服照片：${this.data.tryOnImages.clothing.length ? `已上传${this.data.tryOnImages.clothing.length}张` : '未上传'}`,
        `本人照片：${this.data.tryOnImages.person.length ? `已上传${this.data.tryOnImages.person.length}张` : '未上传'}`,
        `补充需求：${this.data.prompt || '保持人物自然，突出衣服上身效果'}`
      ].join('\n');
    }

    if (this.data.isMockupRender) {
      const form = this.data.mockupForm;

      return [
        '任务：生成商业空间/广告投放效果图',
        `图片/海报素材：${this.data.uploadedImages.length ? `已上传${this.data.uploadedImages.length}张` : '未上传'}`,
        `素材描述：${form.materialDesc || '未填写'}`,
        `投放位置/场景参考图：${this.data.mockupSceneImages.length ? `已上传${this.data.mockupSceneImages.length}张` : '未上传'}`,
        `目标位置描述：${form.sceneDesc || '未填写'}`,
        `图片比例：${this.data.selectedImageRatio}`,
        '生成要求：把素材自然放入目标场景，适配墙面、灯箱、门头、展架等载体的透视、尺寸、光影和环境质感。'
      ].join('\n');
    }

    if (this.data.isHighEqReply) {
      const form = this.data.highEqForm;

      return [
        `回复场景：${form.scenario || '未选择'}`,
        `对方消息/当前情况：${form.message || '未填写'}`,
        `补充要求：${this.data.prompt || '回复自然、得体、有边界感'}`
      ].join('\n');
    }

    if (this.data.isRecipeHelper) {
      const form = this.data.recipeForm;

      return [
        `肉类：${form.meat || '未填写'}`,
        `蔬菜：${form.vegetables || '未填写'}`,
        `蛋奶：${form.eggDairy || '未填写'}`,
        `主食：${form.staple || '未填写'}`,
        `几个人吃：${form.people || '未填写'}`,
        `做几道菜：${form.dishes || '未填写'}`,
        `做饭时间：${form.cookingTime || '未填写'}`,
        `口味偏好：${form.taste || '未填写'}`,
        `厨房工具：${form.tools || '未填写'}`,
        `忌口：${form.taboo || '无'}`,
        `补充需求：${this.data.prompt || '根据现有食材生成家常菜谱方案'}`
      ].join('\n');
    }

    if (this.data.isTravelPlan) {
      const form = this.data.travelForm;
      const travelStyle = form.style === '自定义' ? form.customStyle : form.style;

      return [
        `目的地：${form.destination || '未填写'}`,
        `出发地：${form.departure || '未填写'}`,
        `旅行天数：${form.days || '未填写'}`,
        `预算：${form.budget || '未填写'}`,
        `同行人群：${form.companions || '未填写'}`,
        `旅行风格：${travelStyle || '未填写'}`,
        `补充需求：${this.data.prompt || '生成一份轻松清晰的旅行计划'}`
      ].join('\n');
    }

    if (this.data.isHolidayCampaign) {
      const form = this.data.marketingForm;

      return [
        `行业：${form.industry || '未填写'}`,
        `品类：${form.category || '未填写'}`,
        `品牌名称：${form.brandName || '未填写'}`,
        `节日：${form.festival || '未填写'}`,
        `补充需求：${this.data.prompt || '生成适合商家使用的节日营销活动主题和促销文案'}`
      ].join('\n');
    }

    if (this.data.isHotspotTracker) {
      return [
        `行业：${this.data.marketingForm.industry || '未填写'}`,
        `品类：${this.data.marketingForm.category || '未填写'}`,
        `补充需求：${this.data.prompt || '追踪近期市场热点，并给出适合商家使用的内容方向'}`
      ].join('\n');
    }

    if (this.data.isCommunityBroadcast) {
      const form = this.data.marketingForm;
      const broadcastStyle = form.noteStyle === '自定义' ? form.customStyle : form.noteStyle;

      return [
        `品牌名称：${form.brandName || '未填写'}`,
        `群发风格：${broadcastStyle || '未填写'}`,
        `补充需求：${this.data.prompt || '生成适合私域社群群发的短文案'}`
      ].join('\n');
    }

    if (this.data.isDianpingImage) {
      return [
        `行业：${this.data.marketingForm.industry || '未填写'}`,
        `品类：${this.data.marketingForm.category || '未填写'}`,
        `品牌名称：${this.data.marketingForm.brandName || '未填写'}`,
        `图片分类：${this.data.selectedDianpingCategory}`,
        `图片比例：${this.data.selectedImageRatio}`,
        `需求描述：${this.data.prompt || '生成适合大众点评展示的商家图片'}`
      ].join('\n');
    }

    return this.data.prompt || this.data.skill.defaultPrompt || '';
  },

  validateMarketingForm() {
    const form = this.data.marketingForm;

    if (!this.data.uploadedImages.length) {
      return '请先上传视觉素材';
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

    if (
      this.data.isCommunityBroadcast &&
      this.data.marketingForm.noteStyle === '自定义' &&
      !this.data.marketingForm.customStyle.trim()
    ) {
      wx.showToast({
        title: '请输入自定义风格',
        icon: 'none'
      });
      return;
    }

    if (this.data.isTravelPlan) {
      const form = this.data.travelForm;

      if (!form.destination.trim()) {
        wx.showToast({
          title: '请填写目的地',
          icon: 'none'
        });
        return;
      }

      if (!form.departure.trim()) {
        wx.showToast({
          title: '请填写出发地',
          icon: 'none'
        });
        return;
      }

      if (!form.days.trim()) {
        wx.showToast({
          title: '请填写旅行天数',
          icon: 'none'
        });
        return;
      }

      if (!form.budget.trim()) {
        wx.showToast({
          title: '请填写预算',
          icon: 'none'
        });
        return;
      }

      if (!form.companions.trim()) {
        wx.showToast({
          title: '请填写同行人群',
          icon: 'none'
        });
        return;
      }

      if (form.style === '自定义' && !form.customStyle.trim()) {
        wx.showToast({
          title: '请输入自定义风格',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isRecipeHelper) {
      const form = this.data.recipeForm;
      const hasIngredient = [
        form.meat,
        form.vegetables,
        form.eggDairy,
        form.staple
      ].some(item => item.trim());

      if (!hasIngredient) {
        wx.showToast({
          title: '请填写现有食材',
          icon: 'none'
        });
        return;
      }

      if (!form.people.trim()) {
        wx.showToast({
          title: '请填写几个人吃',
          icon: 'none'
        });
        return;
      }

      if (!form.dishes.trim()) {
        wx.showToast({
          title: '请填写做几道菜',
          icon: 'none'
        });
        return;
      }

      if (!form.cookingTime.trim()) {
        wx.showToast({
          title: '请填写做饭时间',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isHighEqReply && !this.data.highEqForm.message.trim()) {
      wx.showToast({
        title: '请填写对方消息',
        icon: 'none'
      });
      return;
    }

    if (this.data.isResumePolish) {
      if (!this.data.resumeForm.experience.trim()) {
        wx.showToast({
          title: '请填写原始经历',
          icon: 'none'
        });
        return;
      }

      if (!this.data.resumeForm.targetRole.trim()) {
        wx.showToast({
          title: '请填写目标岗位',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isSellingPoints) {
      if (!this.data.productForm.name.trim()) {
        wx.showToast({
          title: '请填写产品名称',
          icon: 'none'
        });
        return;
      }

      if (this.data.productForm.type === '其他' && !this.data.productForm.customType.trim()) {
        wx.showToast({
          title: '请填写产品类型',
          icon: 'none'
        });
        return;
      }

      if (!this.data.productForm.intro.trim()) {
        wx.showToast({
          title: '请填写产品介绍',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isOldPhotoRestore && !this.data.oldPhotoForm.needs.length) {
      wx.showToast({
        title: '请选择修复需求',
        icon: 'none'
      });
      return;
    }

    if (this.data.isTryOn) {
      if (!this.data.tryOnImages.clothing.length) {
        wx.showToast({
          title: '请上传衣服照片',
          icon: 'none'
        });
        return;
      }

      if (!this.data.tryOnImages.person.length) {
        wx.showToast({
          title: '请上传本人照片',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isMockupRender) {
      const hasMaterial = this.data.uploadedImages.length || this.data.mockupForm.materialDesc.trim();
      const hasScene = this.data.mockupSceneImages.length || this.data.mockupForm.sceneDesc.trim();

      if (!hasMaterial) {
        wx.showToast({
          title: '请上传素材或填写素材信息',
          icon: 'none'
        });
        return;
      }

      if (!hasScene) {
        wx.showToast({
          title: '请上传位置图或填写场景信息',
          icon: 'none'
        });
        return;
      }
    }

    if (this.data.isImageSkill && !this.data.isTryOn && !this.data.isMockupRender && !this.data.uploadedImages.length) {
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

    this.consumeQuotaThenCreate(generationPrompt);
  },

  consumeQuotaThenCreate(generationPrompt) {
    request.post('/wallet/consume', {
      skillId: this.data.skillId,
      type: this.data.skill.type
    }).then(res => {
      const result = res.data || {};

      if (!result.ok) {
        wx.showModal({
          title: '无法生成',
          content: result.message || '当前次数或积分不足',
          confirmText: '去充值',
          cancelText: '稍后',
          confirmColor: '#92400e',
          success: modalRes => {
            if (modalRes.confirm) {
              wx.navigateTo({
                url: '/pages/membership/membership'
              });
            }
          }
        });
        return;
      }

      this.createGenerationTask(generationPrompt);
    }).catch(() => {
      wx.showToast({
        title: '账户状态异常',
        icon: 'none'
      });
    });
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
      image: this.getFirstInputImage(),
      images: this.data.isMockupRender
        ? {
          material: this.data.uploadedImages,
          scene: this.data.mockupSceneImages
        }
        : (this.data.isTryOn
        ? {
          clothing: this.data.tryOnImages.clothing,
          person: this.data.tryOnImages.person
        }
        : this.data.uploadedImages)
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
      inputImage: this.getFirstInputImage(),
      inputImages: this.data.isMockupRender
        ? {
          material: this.data.uploadedImages,
          scene: this.data.mockupSceneImages
        }
        : (this.data.isTryOn
        ? {
          clothing: this.data.tryOnImages.clothing,
          person: this.data.tryOnImages.person
        }
        : this.data.uploadedImages),
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
