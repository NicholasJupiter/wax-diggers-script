import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import moment from 'moment';
import VueRouter from 'vue-router';
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.prototype.$stime = function (time) {
  const now = moment();
  const next = moment(time);
  const diff = moment.duration(next - now);
  const hh = diff.hours(),
    mm = diff.minutes(),
    ss = diff.seconds();

  let text = `${hh}:${mm}:${ss}`;

  let zero = false; // 倒计时结束
  if (now.unix() >= next.unix()) {
    zero = true;
  }

  return {
    hh,
    mm,
    ss,
    text,
    zero
  };
};
Vue.use(ElementUi);
Vue.use(VueRouter);

const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
