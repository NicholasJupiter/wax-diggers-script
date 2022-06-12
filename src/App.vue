<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { obser, handleSubs } from './store/light';
import { getNow } from './utils/time';

export default {
  data() {
    return {
      obser,
      handleSubs
    };
  },
  created() {
    window.addEventListener('message', this.toHandler);
  },

  beforeDestroy() {
    window.removeEventListener('message', this.toHandler);
  },
  methods: {
    /**
     * 处理
     */
    toHandler(msg) {
      const { data } = msg;
      if (typeof data !== 'object') return;
      if (!data.__autoScript) return;
      console.log('iframe接收消息: ', data, getNow(), this.handleSubs);
      this.handleSubs.forEach((sub) => sub(data));
    }
  }
};
</script>

<style lang="scss">
* {
  font-family: PingFang SC, Microsoft YaHei, Helvetica, Hiragino Sans GB, SimSun, sans-serif;
  margin: 0;
  padding: 0;
  outline: 0;
  border: 0;
  background-color: transparent;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: normal
}
@import '@/assets/style/comm.scss';

</style>
