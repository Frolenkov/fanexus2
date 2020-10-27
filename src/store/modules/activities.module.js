import { getActivities } from '@/services/activities.service';

const state = {
  list: []
};

const actions = {
  async getActivitiesData({ commit }) {
    commit('setActivitiesData', await getActivities());
  }
};

const mutations = {
  setActivitiesData(state, payload) {
    state.list = payload;
  }
};

export default {
  state,
  actions,
  mutations
};
