const PROFILE_KEY = 'PIXELDOU_USER_PROFILE';
const WALLET_KEY = 'PIXELDOU_USER_WALLET';
const RECORDS_KEY = 'PIXELDOU_RECORDS';
const DEFAULT_AVATAR = '/assets/profile/avatar-pixel.png';
const DAILY_TOTAL = 20;

const SKILL_COSTS = {
  'marketing-note': 20,
  'moments-copy': 10,
  'photo-retouch': 20,
  'dianping-image': 30,
  'old-photo-restore': 20,
  'watermark-remove': 0,
  'try-on': 20,
  'fashion-render': 20
};

function todayKey() {
  const date = new Date();
  const pad = value => String(value).padStart(2, '0');
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
    dailyTotal: DAILY_TOTAL,
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
  normalized.dailyTotal = Number(normalized.dailyTotal) || DAILY_TOTAL;
  normalized.dailyUsed = Math.max(0, Number(normalized.dailyUsed) || 0);
  normalized.todayLeft = Math.max(0, normalized.dailyTotal - normalized.dailyUsed);
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

  if (wallet.todayLeft <= 0) {
    return {
      ok: false,
      cost,
      message: '今日生成次数已用完'
    };
  }

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
    points: wallet.points - check.cost,
    dailyUsed: wallet.dailyUsed + 1
  });

  return {
    ok: true,
    cost: check.cost,
    wallet: nextWallet
  };
}

function recharge(pack = {}) {
  const wallet = getWallet();
  const points = Number(pack.points) || 0;
  const nextWallet = normalizeWallet({
    ...wallet,
    points: wallet.points + points,
    memberLevel: points >= 500 ? '积分会员' : wallet.memberLevel
  });

  return {
    wallet: nextWallet,
    rechargeRecord: {
      id: `recharge_${Date.now()}`,
      packageName: pack.name || '积分套餐',
      price: pack.price || '0',
      points,
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
