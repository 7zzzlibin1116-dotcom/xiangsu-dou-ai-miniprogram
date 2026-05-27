const request = require('../../utils/request');

Page({
  data: {
    loggedIn: false,
    nickName: '微信用户',
    avatarUrl: '/assets/profile/avatar-pixel.png',
    memberLevel: '普通会员',
    memberExpireText: '未开通',
    points: 20,
    totalCount: 0
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
        loggedIn: !!profile.loggedIn,
        nickName: profile.nickName || '微信用户',
        avatarUrl: profile.avatarUrl || '/assets/profile/avatar-pixel.png',
        memberLevel: wallet.memberLevel || '普通会员',
        memberExpireText: wallet.memberExpireText || '未开通',
        points: wallet.points || 0,
        totalCount: wallet.totalCreations || 0
      });
    });
  },

  handleLogin() {
    if (!wx.getUserProfile) {
      wx.showToast({
        title: '当前微信版本不支持授权登录',
        icon: 'none'
      });
      return;
    }

    wx.getUserProfile({
      desc: '用于展示头像昵称和同步创作记录',
      success: res => {
        wx.login({
          success: loginRes => {
            request.post('/auth/login', {
              code: loginRes.code,
              userInfo: res.userInfo
            }).then(() => {
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
              this.loadOverview();
            });
          },
          fail: () => {
            request.post('/auth/login', {
              userInfo: res.userInfo
            }).then(() => {
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
              this.loadOverview();
            });
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '已取消登录',
          icon: 'none'
        });
      }
    });
  },

  handleMenuTap(event) {
    wx.showToast({
      title: `${event.currentTarget.dataset.title} 即将上线`,
      icon: 'none'
    });
  },

  goMembership() {
    wx.navigateTo({
      url: '/pages/membership/membership'
    });
  },

  goTopup() {
    wx.navigateTo({
      url: '/pages/topup/topup'
    });
  },

  goFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  goContact() {
    wx.navigateTo({
      url: '/pages/contact/contact'
    });
  },

  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  }
});
