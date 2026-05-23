const mock = require('./mock');

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

  return mockResponse(null);
}

module.exports = {
  get
};
