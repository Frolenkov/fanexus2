import { setApiHeader } from '~api';
import {
  login,
  logout,
  logoutAll,
  createUser,
  updateUser,
  getCurrentUser
} from '@/services/auth.service';
import { hasToken, saveToken, destroyToken } from '@/services/jwt.service';
/*@TODO revise it, possibly get the user data from the getCurrentUser*/
import {
  getUserData,
  setUserData,
  removeUserData
} from '@/services/storage.service';
import router from '@/router/index';

const state = {
  userData: getUserData(),
  isAuthenticated: false
};

const actions = {
  async login({ commit }, payload) {
    try {
      const res = await login(payload);
      commit('login', res);
      commit('updateAuth', res && res.userData);
    } catch (e) {
      return false;
    }
  },

  async logout({ commit, dispatch }) {
    try {
      await logout();
      commit('logout');
      commit('updateAuth');
      commit('setLoggedIn', false);
      dispatch('setActiveAlias', 0, { root: true });
      if (router.currentRoute.meta.authentication) {
        router.push({ name: 'home' });
      }
    } catch (e) {
      return false;
    }
  },

  async logoutAll({ commit }) {
    try {
      await logoutAll();
      commit('logoutAll');
      commit('updateAuth');
    } catch (e) {
      return false;
    }
  },

  async createUser({ dispatch, rootState }, payload) {
    try {
      await createUser(payload);
      await dispatch('login', payload);
      await dispatch('getUserAliases', undefined, { root: true });
      router.push({
        name: 'edit-blog',
        params: { name: rootState.alias.userAliases[0].Blog.id }
      });
    } catch (e) {
      return false;
    }
  },

  async updateUser({ commit }, payload) {
    commit('updateAuth', await updateUser(...payload));
  },

  async getCurrentUser() {
    try {
      await getCurrentUser();
    } catch (e) {
      return false;
    }
  },

  setLoggedIn({ commit }, value) {
    commit('setLoggedIn', value);
  }
};

const mutations = {
  updateAuth(state, userData) {
    state.isAuthenticated = hasToken();
    userData ? setUserData(userData) : removeUserData();

    state.userData = getUserData();
    setApiHeader();
  },
  login(state, payload) {
    if (payload) {
      saveToken(payload.token);
    }
  },
  logout() {
    destroyToken();
  },
  logoutAll() {
    /*@TODO revise*/
    destroyToken();
  },
  setLoggedIn(state, value) {
    state.isAuthenticated = value;
  }
};

export default {
  state,
  actions,
  mutations
};
