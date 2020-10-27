import {
  getUserAliases,
  setActiveAliasApi,
  getActiveAliasDataApi,
  getAliasFollowingCount
} from '@/services/alias.service';
import {
  getBlogFollowersCount,
  getBlogLikesCount
} from '@/services/Blog/blog.service';
import {
  getNewActivitiesCount,
  watchActivitiesCount,
  unwatchActivitiesCount
} from '@/services/activities.service';
import {
  getActiveAliasStorage,
  setActiveAliasStorage,
  removeActiveAliasStorage
} from '@/services/storage.service';

const state = {
  activeAliasStats: {},
  userAliases: [],
  activeAliasId: getActiveAliasStorage(),
  activeAliasData: null
};

const getters = {
  getActiveAliasAvatarSrc: state => {
    if (state.activeAliasData && state.activeAliasData.avatar) {
      return state.activeAliasData.avatar.src;
    }

    return '';
  },
  activeAliasBlog(state) {
    const activeAlias =
      state.userAliases &&
      state.userAliases.find(alias => alias.id === state.activeAliasId);
    return activeAlias && activeAlias.Blog;
  },
  activeAliasBlogUrl(undefined, getters) {
    return (
      getters.activeAliasBlog &&
      (getters.activeAliasBlog.link || getters.activeAliasBlog.id)
    );
  },
  activeAliasBlogId(undefined, getters) {
    return getters.activeAliasBlog && getters.activeAliasBlog.id;
  }
};

const actions = {
  async getActiveAliasStats({ commit }, { alias, blog }) {
    const [following, followers, likes, activities] = await Promise.all([
      getAliasFollowingCount(alias),
      getBlogFollowersCount(blog),
      getBlogLikesCount(blog),
      getNewActivitiesCount()
    ]);
    commit('setActiveAliasStats', { following, followers, likes, activities });
  },
  async watchActiveAliasActivitiesCount({ commit, dispatch }) {
    try {
      const activities = await watchActivitiesCount();
      if (activities) {
        commit('setActiveAliasStats', { activities });
        dispatch('watchActiveAliasActivitiesCount');
      }
    } catch (e) {
      if (e.code !== 'ECONNABORTED') {
        throw e;
      }
    }
  },
  async unwatchActiveAliasActivitiesCount() {
    await unwatchActivitiesCount();
  },
  async getUserAliases({ commit, state, dispatch }) {
    const payload = await getUserAliases();
    commit('setUserAliases', payload);
    if (!state.activeAliasId) {
      dispatch('initActiveAlias');
    }
  },
  async initActiveAlias({ state, dispatch }) {
    dispatch('setActiveAlias', state.userAliases[0].id);
  },
  async setActiveAlias({ commit }, payload) {
    await setActiveAliasApi(payload);
    setActiveAliasStorage(payload);
    commit('setActiveAlias', payload);
  },
  removeActiveAlias({ commit }) {
    removeActiveAliasStorage();
    commit('removeActiveAlias');
  },
  clearUserAliases({ commit }) {
    commit('clearUserAliases');
  },
  async updateActiveAliasData({ commit, state }) {
    const newActiveAliasData = await getActiveAliasDataApi(state.activeAliasId);
    commit('setActiveAliasData', newActiveAliasData);
  }
};

const mutations = {
  setUserAliases(state, payload) {
    state.userAliases = payload;
  },
  setActiveAlias(state, payload) {
    state.activeAliasId = payload;
  },
  setActiveAliasStats(state, payload) {
    state.activeAliasStats = { ...state.activeAliasStats, ...payload };
  },
  removeActiveAlias(state) {
    state.activeAliasId = null;
  },
  clearUserAliases(state) {
    state.userAliases = [];
  },
  setActiveAliasData(state, payload) {
    state.activeAliasData = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
