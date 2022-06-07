import Vue from 'vue';

const obser = Vue.observable({
  allProp: [], // 所有工具
  waxConfig: {
    // 配置
    isOpen: 1,
    repirType: 0
  },
  gamename: '',
  tables: '',
  waxname: ''
});

// 处理的监听
const handleSubs = [];

export { obser, handleSubs };
