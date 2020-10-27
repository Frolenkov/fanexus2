import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules
});

store.dispatch('setTheme');

export default store;
