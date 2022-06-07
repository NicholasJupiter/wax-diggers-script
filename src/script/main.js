import * as waxjs from '@waxio/waxjs/dist';
import { appendiFrame } from './preview';
import { ExecRun } from './handle';
import { getNow } from '@/utils/time';
import { wax_login } from './wax/wax_event';
import { sendIframe } from './msg';
import { toast } from './toast/index';

if (typeof window === 'object') {
  window.toast = toast;
  console.log('script 加载成功!', new Date());
  window.addEventListener('load', () => {
    toast('加载脚本中!');
    console.log('init wax');
    // new wax
    window.mywax = new waxjs.WaxJS({
      rpcEndpoint: 'https://diggersworld-wax-rpc.global.binfra.one'
    });
    console.log(process.env, 'env');
    if (process.env.NODE_ENV === 'production') {
      try {
        setTimeout(() => {
          toast('进行登录!');
          wax_login();
        }, 5000);
      } catch (error) {}
    }
  });

  // 设置游戏名称
  window.setGameName = (name) => {
    window.gameName = name;
  };
  window.appendiFrame = appendiFrame;
  window.addEventListener('message', async (msg) => {
    const { type, __script } = msg.data;
    if (type && __script) {
      console.log('script:接受消息', msg.data, getNow());
      switch (type) {
        case 'run':
          await ExecRun(msg.data);
      }
      setTimeout(() => {
        sendIframe({
          type: 'reload'
        });
      }, 5000);
    }
  });
}
