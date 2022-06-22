import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import VueRouter from 'vue-router';
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/mixins/util';

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
