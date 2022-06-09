import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import moment from 'moment';
import VueRouter from 'vue-router';
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { padStartZero } from './utils/time';

Vue.config.productionTip = false;

Vue.prototype.$mergeForm = function (baseForm, form) {
  Object.keys(baseForm).forEach((key) => {
    if (form[key] !== undefined) {
      this.$set(baseForm, key, form[key]);
      // baseForm[key] = form[key];
    }
  });
};

Vue.use(ElementUi);
Vue.use(VueRouter);

const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
