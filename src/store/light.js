import Vue from 'vue';

const obser = Vue.observable({
  games: {
    diggers: {
      allTools: [], // 所有工具
      allRush: [] // rush
    }
  },
  gamename: '',
  tables: '',
  owner: '',
  collection_name: ''
});

/**
 * 游戏配置
 */
const gamesConfig = Vue.observable({
  diggers: {
    tools_open: true,
    tools_repirType: 0, // 0: 耐久度到0维修，1: 运行前维修
    tools_betType: [], // 赌
    tools_betEquip: [], // 使用什么类型的装备
    tools_betRarity: [], // 使用什么稀有度的装备
    trolley_open: true,
    trolley_isShort: true // fals长期，true短期
  },
  fishing: {
    tools_open: true,
    useBaitId: 1000, // 使用鱼饵id
    useBaitAmount: 1,
    buyBaitId: 1000, // 购买鱼饵id
    buyBaitAmount: 1
  }
});

// 处理的监听
const handleSubs = [];

export { obser, handleSubs, gamesConfig };
