const KEY_PREFIX = 'fanexus';

export const ACCESS_TOKEN_KEY = `${KEY_PREFIX}_access_token`;
export const USER_DATA_KEY = `${KEY_PREFIX}_user_data`;
export const USER_ACTIVE_ALIAS = `${KEY_PREFIX}_active_alias`;

export const getUserData = () =>
  localStorage.getItem(USER_DATA_KEY)
    ? JSON.parse(localStorage.getItem(USER_DATA_KEY))
    : null;
export const setUserData = userData =>
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
export const removeUserData = () => localStorage.removeItem(USER_DATA_KEY);
export const getActiveAliasStorage = () =>
  localStorage.getItem(USER_ACTIVE_ALIAS)
    ? parseInt(localStorage.getItem(USER_ACTIVE_ALIAS))
    : null;
export const setActiveAliasStorage = activeAlias =>
  localStorage.setItem(USER_ACTIVE_ALIAS, activeAlias);
export const removeActiveAliasStorage = () =>
  localStorage.removeItem(USER_ACTIVE_ALIAS);
