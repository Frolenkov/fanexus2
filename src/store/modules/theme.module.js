const state = {
  themeDark: !!localStorage.getItem('themeDark')
};

const actions = {
  setTheme({ commit }, payload) {
    commit('setTheme', payload);
  }
};

const mutations = {
  setTheme(state, payload) {
    const htmlElement = document.documentElement;

    if (state.themeDark && payload === undefined) {
      return htmlElement.classList.add('theme-dark');
    } else {
      if (payload) {
        htmlElement.classList.add('theme-dark');
        localStorage.setItem('themeDark', payload);
      } else {
        htmlElement.classList.remove('theme-dark');
        localStorage.removeItem('themeDark');
      }
    }

    state.themeDark = !!payload;
  }
};

export default {
  state,
  actions,
  mutations
};
