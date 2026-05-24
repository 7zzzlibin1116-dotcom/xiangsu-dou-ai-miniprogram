const STORAGE_KEY = 'PIXELDOU_FAVORITES';

function getStoredFavorites() {
  const favorites = wx.getStorageSync(STORAGE_KEY);
  return Array.isArray(favorites) ? favorites : [];
}

function saveStoredFavorites(favorites) {
  wx.setStorageSync(STORAGE_KEY, favorites);
}

function getFavoriteKey(type, id) {
  return `${type}:${id}`;
}

function normalizeFavorite(item = {}) {
  const type = item.type || 'record';
  const sourceId = item.sourceId || item.id;

  return {
    favoriteId: getFavoriteKey(type, sourceId),
    type,
    sourceId,
    title: item.title || '未命名收藏',
    desc: item.desc || '',
    image: item.image || '',
    payload: item.payload || {},
    createdAt: Date.now()
  };
}

function getFavorites(type) {
  const favorites = getStoredFavorites();
  return type ? favorites.filter(item => item.type === type) : favorites;
}

function isFavorite(type, sourceId) {
  const favoriteId = getFavoriteKey(type, sourceId);
  return getStoredFavorites().some(item => item.favoriteId === favoriteId);
}

function markListFavorites(list = [], type) {
  const favoriteIds = getStoredFavorites().map(item => item.favoriteId);

  return list.map(item => ({
    ...item,
    favorited: favoriteIds.indexOf(getFavoriteKey(type, item.id)) !== -1
  }));
}

function addFavorite(item) {
  const favorite = normalizeFavorite(item);
  const favorites = getStoredFavorites();
  const exists = favorites.some(current => current.favoriteId === favorite.favoriteId);

  if (!exists) {
    saveStoredFavorites([favorite].concat(favorites));
  }

  return favorite;
}

function removeFavorite(type, sourceId) {
  const favoriteId = getFavoriteKey(type, sourceId);
  const favorites = getStoredFavorites().filter(item => item.favoriteId !== favoriteId);
  saveStoredFavorites(favorites);
}

function toggleFavorite(item) {
  const favorite = normalizeFavorite(item);

  if (isFavorite(favorite.type, favorite.sourceId)) {
    removeFavorite(favorite.type, favorite.sourceId);
    return {
      favorited: false,
      favorite
    };
  }

  addFavorite(favorite);

  return {
    favorited: true,
    favorite
  };
}

module.exports = {
  STORAGE_KEY,
  getFavorites,
  isFavorite,
  markListFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
};
