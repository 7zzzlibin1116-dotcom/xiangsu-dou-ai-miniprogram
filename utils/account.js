const PROFILE_KEY = 'PIXELDOU_USER_PROFILE';
const WALLET_KEY = 'PIXELDOU_USER_WALLET';
const RECORDS_KEY = 'PIXELDOU_RECORDS';
const DEFAULT_AVATAR = '/assets/profile/avatar-pixel.png';

const SKILL_COSTS = {
  'marketing-note': 30,
  'moments-copy': 10,
  'photo-retouch': 20,
  'dianping-image': 30,
  'old-photo-restore': 20,
  'watermark-remove': 0,
  'try-on': 20,
  'fashion-render': 20,
  'fashion-coloring': 20
};

const MEMBERSHIP_DAYS = {
  day: 1,
  month: 30,
  half: 180,
  year: 365
};

function getMemberLevelByPackage(pack = {}) {
  if (pack.isTopup) {
    return '';
  }

  if (pack.id === 'day' || pack.id === 'month') {
    return '高级会员';
  }

  if (pack.id === 'half') {
    return '钻石会员';
  }

  if (pack.id === 'year') {
    return '黑金会员';
  }

  return '';
}

function getMembershipDays(pack = {}) {
  return MEMBERSHIP_DAYS[pack.id] || 0;
}

function todayKey() {
  const date = new Date();
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(timestamp) {
  const value = Number(timestamp) || 0;

  if (!value) {
    return '未开通';
  }

  const date = new Date(value);
  const pad = number => String(number).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getRecords() {
  const records = wx.getStorageSync(RECORDS_KEY);
  return Array.isArray(records) ? records : [];
}

function getDefaultProfile() {
  return {
    loggedIn: false,
    nickName: '微信用户',
    avatarUrl: DEFAULT_AVATAR,
    userId: 'mock_guest'
  };
}

function getDefaultWallet() {
  return {
    points: 20,
    memberLevel: '普通会员',
    memberExpireAt: 0,
    memberExpireText: '未开通',
    dailyTotal: 0,
    dailyUsed: 0,
    lastActiveDate: todayKey()
  };
}

function normalizeWallet(wallet = {}) {
  const normalized = {
    ...getDefaultWallet(),
    ...wallet
  };

  if (normalized.lastActiveDate !== todayKey()) {
    normalized.dailyUsed = 0;
    normalized.lastActiveDate = todayKey();
  }

  normalized.points = Math.max(0, Number(normalized.points) || 0);
  normalized.memberLevel = normalized.memberLevel || '普通会员';
  if (normalized.memberLevel === '积分会员') {
    normalized.memberLevel = '高级会员';
  }
  normalized.memberExpireAt = Math.max(0, Number(normalized.memberExpireAt) || 0);
  if (normalized.memberExpireAt && normalized.memberExpireAt <= Date.now()) {
    normalized.memberLevel = '普通会员';
    normalized.memberExpireAt = 0;
  }
  normalized.memberExpireText = formatDate(normalized.memberExpireAt);
  normalized.dailyTotal = 0;
  normalized.dailyUsed = 0;
  normalized.todayLeft = '不限';
  normalized.totalCreations = getRecords().length;

  wx.setStorageSync(WALLET_KEY, normalized);

  return normalized;
}

function initAccount() {
  const profile = wx.getStorageSync(PROFILE_KEY);
  const wallet = wx.getStorageSync(WALLET_KEY);

  if (!profile) {
    wx.setStorageSync(PROFILE_KEY, getDefaultProfile());
  }

  if (!wallet) {
    wx.setStorageSync(WALLET_KEY, getDefaultWallet());
  }

  normalizeWallet(wx.getStorageSync(WALLET_KEY));
}

function getProfile() {
  return {
    ...getDefaultProfile(),
    ...(wx.getStorageSync(PROFILE_KEY) || {})
  };
}

function getWallet() {
  return normalizeWallet(wx.getStorageSync(WALLET_KEY) || getDefaultWallet());
}

function getOverview() {
  return {
    profile: getProfile(),
    wallet: getWallet()
  };
}

function login(userInfo = {}) {
  const cachedProfile = wx.getStorageSync(PROFILE_KEY) || {};
  const profile = {
    loggedIn: true,
    nickName: userInfo.nickName || '微信用户',
    avatarUrl: userInfo.avatarUrl || DEFAULT_AVATAR,
    userId: userInfo.userId || cachedProfile.userId || `mock_${Date.now()}`,
    loginCode: userInfo.code || ''
  };

  wx.setStorageSync(PROFILE_KEY, profile);

  return getOverview();
}

function logout() {
  wx.setStorageSync(PROFILE_KEY, getDefaultProfile());
  return getOverview();
}

function getCostBySkill(skill = {}) {
  if (String(skill.skillId || '').indexOf('similar-') === 0) {
    return 20;
  }

  if (SKILL_COSTS[skill.skillId]) {
    return SKILL_COSTS[skill.skillId];
  }

  return skill.type === 'image' ? 20 : 10;
}

function canGenerate(skill = {}) {
  const wallet = getWallet();
  const cost = getCostBySkill(skill);

  if (wallet.points < cost) {
    return {
      ok: false,
      cost,
      message: `积分不足，本次需要 ${cost} 积分`
    };
  }

  return {
    ok: true,
    cost,
    wallet
  };
}

function consumeForGeneration(skill = {}) {
  const check = canGenerate(skill);

  if (!check.ok) {
    return check;
  }

  const wallet = getWallet();
  const nextWallet = normalizeWallet({
    ...wallet,
    points: wallet.points - check.cost
  });

  return {
    ok: true,
    cost: check.cost,
    wallet: nextWallet
  };
}

function recharge(pack = {}) {
  const wallet = getWallet();

  if (pack.isTopup && wallet.memberLevel === '普通会员') {
    return {
      ok: false,
      message: '积分加油包仅限会员购买，请先开通会员',
      wallet
    };
  }

  const points = Number(pack.points) || 0;
  const membershipDays = getMembershipDays(pack);
  const memberLevel = getMemberLevelByPackage(pack) || wallet.memberLevel;
  const memberExpireAt = membershipDays
    ? Math.max(Date.now(), Number(wallet.memberExpireAt) || 0) + membershipDays * 24 * 60 * 60 * 1000
    : wallet.memberExpireAt;
  const nextWallet = normalizeWallet({
    ...wallet,
    points: wallet.points + points,
    memberLevel,
    memberExpireAt
  });

  return {
    ok: true,
    wallet: nextWallet,
    rechargeRecord: {
      id: `recharge_${Date.now()}`,
      packageName: pack.name || '积分套餐',
      price: pack.price || '0',
      points,
      memberLevel: nextWallet.memberLevel,
      memberExpireAt: nextWallet.memberExpireAt,
      memberExpireText: nextWallet.memberExpireText,
      createdAt: Date.now()
    }
  };
}

module.exports = {
  PROFILE_KEY,
  WALLET_KEY,
  DEFAULT_AVATAR,
  initAccount,
  getProfile,
  getWallet,
  getOverview,
  login,
  logout,
  getCostBySkill,
  canGenerate,
  consumeForGeneration,
  recharge
};
