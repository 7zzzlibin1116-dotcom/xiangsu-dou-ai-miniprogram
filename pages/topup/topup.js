const request = require('../../utils/request');

Page({
  data: {
    amount: '',
    points: 0,
    currentPoints: 0,
    memberLevel: '普通会员',
    canBuyTopup: false
  },

  onShow() {
    this.loadOverview();
  },

  loadOverview() {
    request.get('/user/overview').then(res => {
      const wallet = (res.data || {}).wallet || {};

      this.setData({
        currentPoints: wallet.points || 0,
        memberLevel: wallet.memberLevel || '普通会员',
        canBuyTopup: wallet.memberLevel && wallet.memberLevel !== '普通会员'
      });
    });
  },

  handleAmountInput(event) {
    const rawValue = String(event.detail.value || '').replace(/[^\d.]/g, '');
    const amount = rawValue.replace(/^(\d+)(\.\d{0,2}).*$/, '$1$2');
    const numericAmount = Number(amount) || 0;

    this.setData({
      amount,
      points: Math.floor(numericAmount * 20)
    });
  },

  quickSelect(event) {
    const amount = String(event.currentTarget.dataset.amount || '');
    const numericAmount = Number(amount) || 0;

    this.setData({
      amount,
      points: Math.floor(numericAmount * 20)
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

  handleRecharge() {
    if (!this.data.canBuyTopup) {
      wx.showModal({
        title: '会员专属',
        content: '积分加油包仅限会员购买，请先开通会员套餐。',
        confirmText: '去开通',
        cancelText: '稍后',
        confirmColor: '#92400e',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/membership/membership'
            });
          }
        }
      });
      return;
    }

    const amount = Number(this.data.amount);
    const points = Math.floor(amount * 20);

    if (!amount || amount <= 0 || points <= 0) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认充值',
      content: `充值 ¥${amount.toFixed(2)}，获得 ${points} 积分`,
      confirmText: '确认',
      confirmColor: '#92400e',
      success: res => {
        if (!res.confirm) return;

        request.post('/wallet/recharge', {
          id: 'points-topup',
          name: '积分加油包',
          price: amount.toFixed(2),
          points,
          isTopup: true
        }).then(result => {
          const data = result.data || {};

          if (data.ok === false) {
            wx.showModal({
              title: '会员专属',
              content: data.message || '请先开通会员套餐',
              confirmText: '去开通',
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

          wx.showToast({
            title: '充值成功',
            icon: 'success'
          });

          this.setData({
            amount: '',
            points: 0
          });
          this.loadOverview();
        });
      }
    });
  }
});
