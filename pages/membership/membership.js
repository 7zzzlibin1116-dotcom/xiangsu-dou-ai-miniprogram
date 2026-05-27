const request = require('../../utils/request');

Page({
  data: {
    points: 20,
    avatarUrl: '/assets/membership/avatar.png',
    memberLevel: '普通会员',
    memberExpireText: '未开通',
    selectedId: 'month',
    selectedPackage: {
      id: 'month',
      name: '月度套餐',
      price: '39.9',
      points: 600
    },
    packages: [
      {
        id: 'day',
        name: '单日套餐',
        badge: '今日推荐',
        badgeClass: 'badge-yellow',
        price: '9.9',
        period: '1天',
        points: 100,
        desc: '适合临时体验'
      },
      {
        id: 'month',
        name: '月度套餐',
        badge: '最受欢迎',
        badgeClass: 'badge-red',
        price: '39.9',
        period: '月',
        points: 600,
        desc: '每日创作，营销修图都够用'
      },
      {
        id: 'half',
        name: '半年套餐',
        badge: '省钱优选',
        badgeClass: 'badge-green',
        price: '199',
        period: '半年',
        points: 3600,
        desc: '平均每月约 ¥33.2'
      },
      {
        id: 'year',
        name: '年度套餐',
        badge: '超值推荐',
        badgeClass: 'badge-purple',
        price: '399',
        period: '年',
        points: 7200,
        desc: '适合长期创作者和商家'
      }
    ],
    rules: [
      {
        icon: '/assets/membership/rule-copy.png',
        title: '普通文案生成',
        cost: '10 积分 / 次'
      },
      {
        icon: '/assets/membership/rule-note.png',
        title: '营销笔记生成',
        cost: '30 积分 / 次'
      },
      {
        icon: '/assets/membership/rule-retouch.png',
        title: 'AI 修图',
        cost: '20 积分 / 次'
      },
      {
        icon: '/assets/membership/rule-similar.png',
        title: '相似图片生成',
        cost: '20 积分 / 次'
      }
    ],
    benefits: [
      {
        icon: '/assets/membership/benefit-coin.png',
        text: '充值后积分\n立即到账'
      },
      {
        icon: '/assets/membership/benefit-spark.png',
        text: '积分可用于\n所有 AI Skills'
      },
      {
        icon: '/assets/membership/benefit-crown.png',
        text: '会员优先\n体验新功能'
      },
      {
        icon: '/assets/membership/benefit-lightning.png',
        text: '高清图片\n优先生成'
      }
    ]
  },

  onShow() {
    this.loadOverview();
  },

  loadOverview() {
    request.get('/user/overview').then(res => {
      const overview = res.data || {};
      const profile = overview.profile || {};
      const wallet = overview.wallet || {};

      this.setData({
        points: wallet.points || 0,
        memberLevel: wallet.memberLevel || '普通会员',
        memberExpireText: wallet.memberExpireText || '未开通',
        avatarUrl: profile.avatarUrl || '/assets/membership/avatar.png'
      });
    });
  },

  getSelectedPackage() {
    return this.data.packages.find(item => item.id === this.data.selectedId) || this.data.packages[0];
  },

  selectPackage(event) {
    const selectedId = event.currentTarget.dataset.id;
    const selectedPackage = this.data.packages.find(item => item.id === selectedId);

    this.setData({
      selectedId,
      selectedPackage
    });
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
      return;
    }

    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  showRechargeRecords() {
    wx.showToast({
      title: '充值记录即将上线',
      icon: 'none'
    });
  },

  goTopup() {
    wx.navigateTo({
      url: '/pages/topup/topup'
    });
  },

  handleRecharge() {
    const selected = this.getSelectedPackage();

    wx.showModal({
      title: '确认充值',
      content: `充值 ¥${selected.price}，获得 ${selected.points} 积分`,
      confirmText: '确认',
      confirmColor: '#92400e',
      success: res => {
        if (!res.confirm) return;

        request.post('/wallet/recharge', selected).then(() => {
          wx.showToast({
            title: '充值成功',
            icon: 'success'
          });
          this.loadOverview();
        });
      }
    });
  }
});
