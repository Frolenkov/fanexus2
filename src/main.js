import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/scss/main.scss';
import { apiInit } from '~api';
import { LAYOUTS } from '@/services/layout.service';
import DefaultLayout from '@/layouts/Default';
import PureLayout from '@/layouts/Pure';

// layouts
const { DEFAULT, PURE } = LAYOUTS;

Vue.component(DEFAULT, DefaultLayout);
Vue.component(PURE, PureLayout);

apiInit();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
