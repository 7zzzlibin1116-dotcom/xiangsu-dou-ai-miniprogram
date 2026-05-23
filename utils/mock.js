const STORAGE_KEY = 'PIXELDOU_RECORDS';

const categories = [
  { id: 'marketing', name: '日常营销' },
  { id: 'life', name: '日常生活' },
  { id: 'student', name: '学生学习' },
  { id: 'work', name: '工作效率' }
];

const mockResultImages = [
  '/assets/empty/empty-result.png',
  '/assets/empty/inspiration-placeholder.png',
  '/assets/backgrounds/home-brand-banner.png',
  '/assets/backgrounds/profile-brand-banner.png',
  '/assets/backgrounds/pixel-dot-bg.png'
];

const skills = [
  {
    id: 'marketing-note',
    title: '营销笔记生成',
    description: '快速生成小红书、点评风格种草笔记。',
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
    description: '上传图片，模拟优化光线、质感和构图。',
    category: 'marketing',
    type: 'image',
    icon: '图',
    iconImage: '/assets/skills/photo-retouch.png',
    promptPlaceholder: '按你的想法修改图片，例如：修改文字、去除杂物、调整颜色、增强清晰度',
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
    id: 'image-style',
    title: '图片风格转换',
    description: '把照片模拟转换为胶片、插画等风格。',
    category: 'life',
    type: 'image',
    icon: '风',
    iconImage: '/assets/skills/image-style.png',
    tags: ['图片', '风格']
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
    id: 'essay-polish',
    title: '作文润色',
    description: '优化作文表达，让结构和语句更自然。',
    category: 'student',
    type: 'text',
    icon: '作',
    iconImage: '/assets/skills/essay-polish.png',
    tags: ['学生', '写作']
  },
  {
    id: 'paper-outline',
    title: '论文大纲',
    description: '根据题目生成论文结构和章节重点。',
    category: 'student',
    type: 'text',
    icon: '纲',
    iconImage: '/assets/skills/paper-outline.png',
    tags: ['论文', '大纲']
  },
  {
    id: 'english-translate',
    title: '英语翻译',
    description: '翻译并润色英文表达，适合学习场景。',
    category: 'student',
    type: 'text',
    icon: '译',
    iconImage: '/assets/skills/english-translate.png',
    tags: ['英语', '学习']
  },
  {
    id: 'paper-check',
    title: '论文查重',
    description: '模拟识别高重复表达并给出改写建议。',
    category: 'student',
    type: 'text',
    icon: '查',
    iconImage: '/assets/skills/paper-check.png',
    tags: ['论文', '改写']
  },
  {
    id: 'ppt-outline',
    title: 'PPT 大纲',
    description: '快速生成汇报型 PPT 页标题和内容框架。',
    category: 'student',
    type: 'text',
    icon: 'P',
    iconImage: '/assets/skills/ppt-outline.png',
    tags: ['PPT', '汇报']
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
    id: 'meeting-summary',
    title: '会议纪要',
    description: '把会议要点整理成行动项和结论摘要。',
    category: 'work',
    type: 'text',
    icon: '会',
    iconImage: '/assets/skills/meeting-summary.png',
    tags: ['效率', '总结']
  },
  {
    id: 'email-polish',
    title: '邮件润色',
    description: '把草稿改成清晰、得体的商务邮件。',
    category: 'work',
    type: 'text',
    icon: '邮',
    iconImage: '/assets/skills/email-polish.png',
    tags: ['工作', '沟通']
  },
  {
    id: 'weekly-report',
    title: '周报生成',
    description: '根据本周事项生成简洁专业的工作周报。',
    category: 'work',
    type: 'text',
    icon: '周',
    iconImage: '/assets/skills/weekly-report.png',
    tags: ['周报', '效率']
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

function saveRecord(record) {
  const records = wx.getStorageSync(STORAGE_KEY) || [];
  const normalized = {
    id: `record_${Date.now()}`,
    status: '已完成',
    createdAt: formatTime(new Date()),
    ...record
  };

  wx.setStorageSync(STORAGE_KEY, [normalized].concat(Array.isArray(records) ? records : []));
  return normalized;
}

module.exports = {
  STORAGE_KEY,
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
  saveRecord
};
