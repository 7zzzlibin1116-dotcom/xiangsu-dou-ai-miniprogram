const mock = require('./mock');
const account = require('./account');
const favorites = require('./favorites');

function mockResponse(data, delay = 260) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'ok',
        data
      });
    }, delay);
  });
}

function get(url, params = {}) {
  return getMock(url, params);
}

function post(url, data = {}) {
  return postMock(url, data);
}

function getMock(url, params = {}) {
  if (url === '/skills') {
    return mock.getSkills(params).then(data => mockResponse(data));
  }

  if (/^\/skills\/[^/]+$/.test(url)) {
    const id = url.replace('/skills/', '');
    return mock.getSkillById(id).then(data => mockResponse(data));
  }

  if (url === '/records') {
    return mock.getRecords().then(data => mockResponse(data));
  }

  if (url === '/favorites') {
    return mockResponse(favorites.getFavorites(params.type));
  }

  if (url === '/user/profile') {
    return mockResponse(account.getProfile());
  }

  if (url === '/user/wallet') {
    return mockResponse(account.getWallet());
  }

  if (url === '/user/overview') {
    return mockResponse(account.getOverview());
  }

  return mockResponse(null);
}

function postMock(url, data = {}) {
  if (url === '/auth/login') {
    return mockResponse(account.login({
      ...(data.userInfo || data),
      code: data.code || ''
    }));
  }

  if (url === '/auth/logout') {
    return mockResponse(account.logout());
  }

  if (url === '/wallet/consume') {
    return mockResponse(account.consumeForGeneration(data));
  }

  if (url === '/wallet/recharge') {
    return mockResponse(account.recharge(data));
  }

  if (url === '/favorites/toggle') {
    return mockResponse(favorites.toggleFavorite(data));
  }

  if (url === '/favorites/remove') {
    favorites.removeFavorite(data.type, data.sourceId);
    return mockResponse({ success: true });
  }

  if (url === '/records/delete') {
    return mock.deleteRecord(data.id).then(result => mockResponse(result));
  }

  if (url === '/records/clear') {
    return mock.clearRecords().then(result => mockResponse(result));
  }

  if (url === '/feedback') {
    return mockResponse(mock.saveFeedback(data));
  }

  return mockResponse(null);
}

module.exports = {
  get,
  post
};
