import { gamesConfig, obser } from '@/store/light.js';
export default {
  data() {
    return {
      obser,
      gamesConfig
    };
  },
  methods: {
    // 获取参数
    getRowProp(template_id) {
      return this.obser.allProp.find((item) => item.template_id == template_id);
    },

    /**
     * 发送消息
     * @param {any} msg 消息
     */
    sendMessage(msg) {
      const data = { __script: true, ...msg, gamesConfig: { ...gamesConfig } };
      console.log('send message....', data);
      try {
        window.postMessage(data, '*');
      } catch (error) {}
      if (window.parent !== window.self) {
        window.parent.postMessage(data, '*');
        return;
      }
    }
  }
};
