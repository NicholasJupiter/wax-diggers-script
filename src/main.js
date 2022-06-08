import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import moment from 'moment';
import VueRouter from 'vue-router';
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.prototype.$mergeForm = function (baseForm, form) {
  Object.keys(baseForm).forEach((key) => {
    if (form[key] !== undefined) {
      this.$set(baseForm, key, form[key]);
      // baseForm[key] = form[key];
    }
  });
};

Vue.prototype.$stime = function (time) {
  const now = moment();
  const next = moment(time);
  const diff = moment.duration(next - now);
  const hh = diff.hours(),
    mm = diff.minutes(),
    ss = diff.seconds();

  let text = `${hh}:${mm}:${ss}`;

  let zero = now.unix() >= next.unix(); // 倒计时结束

  return {
    hh,
    mm,
    ss,
    text: zero ? '00:00:00' : text,
    zero
  };
};
Vue.use(ElementUi);
Vue.use(VueRouter);

const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
