const STORAGE_KEY = 'PIXELDOU_RECORDS';
const FEEDBACK_STORAGE_KEY = 'PIXELDOU_FEEDBACKS';

const categories = [
  { id: 'marketing', name: '日常营销' },
  { id: 'life', name: '日常生活' },
  { id: 'student', name: '学生学习' },
  { id: 'work', name: '工作效率' }
];

const mockResultImages = [
  '/assets/empty/empty-result.png',
  '/assets/empty/inspiration-placeholder.png'
];

const skills = [
  {
    id: 'marketing-note',
    title: '海报笔记生成',
    description: '快速生成营销海报、营销笔记。',
    category: 'marketing',
    type: 'text',
    icon: '文',
    iconImage: '/assets/skills/marketing-note.png',
    tags: ['营销', '文案', '种草']
  },
  {
    id: 'moments-copy',
    title: '朋友圈生成',
    description: '上传素材，生成适合朋友圈营销的图文内容。',
    category: 'marketing',
    type: 'image',
    icon: '圈',
    iconImage: '/assets/skills/moments-copy.png',
    tags: ['私域', '图文']
  },
  {
    id: 'photo-retouch',
    title: '修图',
    description: '其他板块生成的图片需要修改细节在这里',
    category: 'marketing',
    type: 'image',
    icon: '图',
    iconImage: '/assets/skills/photo-retouch.png',
    promptPlaceholder: '其他板块生成的图片需要修改细节在这里',
    defaultPrompt: '根据用户上传的图片进行 AI 修图，优先提升清晰度、光线、色彩、构图和整体质感；如果用户填写了具体修改要求，以用户要求为准，保持画面自然真实。',
    tags: ['图片', '修图']
  },
  {
    id: 'dianping-image',
    title: '大众点评图片',
    description: '生成更适合店铺展示的点评图片风格。',
    category: 'marketing',
    type: 'image',
    icon: '店',
    iconImage: '/assets/skills/dianping-image.png',
    tags: ['商家', '图片']
  },
  {
    id: 'holiday-campaign',
    title: '商家节日营销',
    description: '按节日自动生成活动主题和促销文案。',
    category: 'marketing',
    type: 'text',
    icon: '节',
    iconImage: '/assets/skills/holiday-campaign.png',
    tags: ['营销', '节日']
  },
  {
    id: 'hotspot-tracker',
    title: '市场热点追踪',
    description: '模拟整理近期热点并匹配可用营销角度。',
    category: 'marketing',
    type: 'text',
    icon: '热',
    iconImage: '/assets/skills/hotspot-tracker.png',
    tags: ['热点', '爆款']
  },
  {
    id: 'community-broadcast',
    title: '私域群发文案',
    description: '生成适合社群群发的短促销消息。',
    category: 'marketing',
    type: 'text',
    icon: '群',
    iconImage: '/assets/skills/community-broadcast.png',
    tags: ['私域', '转化']
  },
  {
    id: 'selling-points',
    title: '产品卖点提炼',
    description: '把普通介绍提炼成清晰可传播的卖点。',
    category: 'marketing',
    type: 'text',
    icon: '卖',
    iconImage: '/assets/skills/selling-points.png',
    tags: ['产品', '文案']
  },
  {
    id: 'old-photo-restore',
    title: '老照片修复',
    description: '上传旧照片，模拟清晰化和色彩修复。',
    category: 'life',
    type: 'image',
    icon: '旧',
    iconImage: '/assets/skills/old-photo-restore.png',
    tags: ['图片', '修复']
  },
  {
    id: 'watermark-remove',
    title: '去图片水印',
    description: '上传一张图片，模拟去除水印、文字或遮挡元素。',
    category: 'life',
    type: 'image',
    badge: '免费',
    icon: '净',
    iconImage: '/assets/skills/photo-retouch.png',
    uploadLabel: '上传需要去水印的图片',
    uploadText: '上传图片',
    maxUploadCount: 1,
    promptPlaceholder: '可选填写水印位置，例如：右下角文字、画面中间 logo、顶部日期水印',
    defaultPrompt: '根据用户上传的单张图片，去除图片中的水印、文字、logo 或遮挡元素，并自然补全背景纹理，保持画面真实干净。',
    tags: ['图片', '去水印']
  },
  {
    id: 'high-eq-reply',
    title: '高情商回复',
    description: '根据不同聊天场景，生成得体自然的回复。',
    category: 'life',
    type: 'text',
    icon: '回',
    iconImage: '/assets/skills/community-broadcast.png',
    tags: ['沟通', '回复']
  },
  {
    id: 'try-on',
    title: '试穿衣服',
    description: '上传参考图，模拟生成试穿展示效果。',
    category: 'life',
    type: 'image',
    icon: '衣',
    iconImage: '/assets/skills/try-on.png',
    tags: ['图片', '穿搭']
  },
  {
    id: 'travel-plan',
    title: '旅行计划',
    description: '按预算、天数和偏好生成轻量行程。',
    category: 'life',
    type: 'text',
    icon: '行',
    iconImage: '/assets/skills/travel-plan.png',
    tags: ['生活', '计划']
  },
  {
    id: 'recipe-helper',
    title: '菜谱灵感',
    description: '根据食材和口味生成家常菜方案。',
    category: 'life',
    type: 'text',
    icon: '食',
    iconImage: '/assets/skills/recipe-helper.png',
    tags: ['生活', '灵感']
  },
  {
    id: 'id-photo',
    title: '证件照生成/换底色',
    description: '上传照片，生成证件照或快速更换背景色。',
    category: 'student',
    type: 'image',
    icon: '证',
    iconImage: '/assets/skills/essay-polish.png',
    uploadLabel: '上传人像照片',
    uploadText: '上传正面照片',
    promptPlaceholder: '可选填写要求，例如：保持自然、不要过度美颜、衣服正式一点',
    defaultPrompt: '根据上传人像生成规范证件照，保持五官自然清晰。',
    tags: ['学生', '证件照']
  },
  {
    id: 'paper-check',
    title: '论文查重',
    description: '模拟识别高重复表达并给出改写建议。',
    category: 'student',
    type: 'text',
    icon: '查',
    iconImage: '/assets/skills/paper-check.png',
    defaultPrompt: '检查用户提供的论文片段中可能重复、口语化或表达不够学术的内容，并给出降重改写建议；输出改写版本和修改原因，保持原意不变。',
    tags: ['论文', '改写']
  },
  {
    id: 'fashion-render',
    title: '服装设计效果图',
    description: '上传服装线稿，生成完整设计效果图。',
    category: 'student',
    type: 'image',
    icon: '衣',
    iconImage: '/assets/skills/fashion-render.png',
    uploadLabel: '上传线稿',
    uploadText: '上传服装线稿',
    promptPlaceholder: '可选填写面料、颜色、廓形、风格，例如：白色雪纺连衣裙、法式复古',
    defaultPrompt: '根据上传的服装线稿生成完整服装设计效果图，补全面料、颜色、结构细节和成衣质感。',
    tags: ['学生', '服装', '效果图']
  },
  {
    id: 'mockup-render',
    title: '效果图生成',
    description: '上传海报或图片，生成墙面、灯箱、门头等场景效果图。',
    category: 'work',
    type: 'image',
    icon: '效',
    iconImage: '/assets/skills/photo-retouch.png',
    uploadLabel: '上传图片或海报',
    uploadText: '上传图片或海报',
    promptPlaceholder: '例如：放到商场灯箱、门店门头、展架、墙面海报位',
    defaultPrompt: '根据用户提供的图片或海报素材，以及目标投放场景，生成真实自然的空间效果图，保持素材内容清晰可读，匹配墙面、灯箱、门头、展架等载体透视和光影。',
    tags: ['效果图', '海报', '场景']
  },
  {
    id: 'resume-polish',
    title: '简历优化',
    description: '优化项目经历描述，突出结果和价值。',
    category: 'work',
    type: 'text',
    icon: '历',
    iconImage: '/assets/skills/resume-polish.png',
    tags: ['求职', '表达']
  }
];

const inspirationCategories = [
  { id: 'hot', name: '热门' },
  { id: 'people', name: '人物' },
  { id: 'couple', name: '情侣' },
  { id: 'pet', name: '宠物' },
  { id: 'baby', name: '宝宝' },
  { id: 'product', name: '产品' },
  { id: 'food', name: '美食' }
];

const inspirations = [
  {
    id: 'case-1',
    title: '美食种草原型',
    category: 'food',
    categoryIds: ['hot', 'food', 'product'],
    likes: 128
  },
  {
    id: 'case-2',
    title: '人物写真原型',
    category: 'people',
    categoryIds: ['hot', 'people'],
    likes: 96
  },
  {
    id: 'case-3',
    title: '情侣合照原型',
    category: 'couple',
    categoryIds: ['hot', 'couple', 'people'],
    likes: 231
  },
  {
    id: 'case-4',
    title: '宠物可爱原型',
    category: 'pet',
    categoryIds: ['hot', 'pet'],
    likes: 73
  },
  {
    id: 'case-5',
    title: '宝宝成长原型',
    category: 'baby',
    categoryIds: ['hot', 'baby', 'people'],
    likes: 156
  },
  {
    id: 'case-6',
    title: '产品展示原型',
    category: 'product',
    categoryIds: ['hot', 'product'],
    likes: 89
  },
  {
    id: 'case-7',
    title: '人物氛围原型',
    category: 'people',
    categoryIds: ['people', 'hot'],
    likes: 104
  },
  {
    id: 'case-8',
    title: '美食海报原型',
    category: 'food',
    categoryIds: ['food', 'hot'],
    likes: 67
  }
];

const mockTasks = {};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getRandomResultImage(seed) {
  const index = Math.abs(String(seed || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % mockResultImages.length;
  return mockResultImages[index];
}

function getInspirationById(id) {
  return clone(inspirations.find(item => item.id === id) || inspirations[0]);
}

function formatTime(date) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getSkills(params = {}) {
  const list = params.category
    ? skills.filter(item => item.category === params.category)
    : skills;

  return Promise.resolve(clone(list));
}

function getSkillById(id) {
  const skill = skills.find(item => item.id === id);
  return Promise.resolve(skill ? clone(skill) : null);
}

function createTask(payload = {}) {
  const taskId = `task_${Date.now()}`;
  const skill = skills.find(item => item.id === payload.skillId) || skills[0];
  const resultImage = getRandomResultImage(`${payload.skillId}${payload.prompt}${taskId}`);

  mockTasks[taskId] = {
    taskId,
    status: 'processing',
    skillId: skill.id,
    resultImage,
    createdAt: Date.now()
  };

  setTimeout(() => {
    if (mockTasks[taskId]) {
      mockTasks[taskId].status = 'completed';
    }
  }, 1800);

  return Promise.resolve({
    taskId,
    status: 'processing'
  });
}

function getTaskStatus(taskId) {
  const task = mockTasks[taskId];

  if (!task) {
    return Promise.resolve({
      taskId,
      status: 'failed',
      message: '任务不存在'
    });
  }

  return Promise.resolve(clone(task));
}

function getRecords() {
  const records = wx.getStorageSync(STORAGE_KEY) || [];
  return Promise.resolve(Array.isArray(records) ? clone(records) : []);
}

function deleteRecord(id) {
  const records = wx.getStorageSync(STORAGE_KEY) || [];
  const nextRecords = Array.isArray(records)
    ? records.filter(item => item.id !== id)
    : [];

  wx.setStorageSync(STORAGE_KEY, nextRecords);

  return Promise.resolve({
    success: true
  });
}

function clearRecords() {
  wx.setStorageSync(STORAGE_KEY, []);

  return Promise.resolve({
    success: true
  });
}

function saveRecord(record) {
  const records = wx.getStorageSync(STORAGE_KEY) || [];
  const profile = wx.getStorageSync('PIXELDOU_USER_PROFILE') || {};
  const normalized = {
    id: `record_${Date.now()}`,
    status: '已完成',
    createdAt: formatTime(new Date()),
    userId: profile.userId || 'mock_guest',
    ...record
  };

  wx.setStorageSync(STORAGE_KEY, [normalized].concat(Array.isArray(records) ? records : []));
  return normalized;
}

function saveFeedback(feedback) {
  const feedbacks = wx.getStorageSync(FEEDBACK_STORAGE_KEY) || [];
  const normalized = {
    id: `feedback_${Date.now()}`,
    createdAt: formatTime(new Date()),
    status: '已提交',
    ...feedback
  };

  wx.setStorageSync(FEEDBACK_STORAGE_KEY, [normalized].concat(Array.isArray(feedbacks) ? feedbacks : []));
  return normalized;
}

module.exports = {
  STORAGE_KEY,
  FEEDBACK_STORAGE_KEY,
  categories,
  inspirationCategories,
  skills,
  inspirations,
  mockResultImages,
  getSkills,
  getSkillById,
  getInspirationById,
  createTask,
  getTaskStatus,
  getRecords,
  deleteRecord,
  clearRecords,
  saveRecord,
  saveFeedback
};
