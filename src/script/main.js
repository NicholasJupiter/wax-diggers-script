import { appendiFrame } from './preview';
import { getNow } from '@/utils/time';
import { wax_login, wax_transact } from './wax/wax_event';
import { toast } from './toast/index';
import { getQueryString } from '@/utils/util';

if (typeof window === 'object') {
  window.wax_login = wax_login;
  window.wax_transact = wax_transact;
  window.toast = toast;
  window.appendiFrame = () => {};
  window.__autoScriptHandlers = [];
  window.setGameName = (name) => {
    window.gameName = name;
  };
  toast('脚本加载中!', getNow());

  if (process.env.NODE_ENV === 'development') {
    window.gameName = getQueryString('gamename');
  }

  window.addEventListener('load', () => {
    console.log(process.env, window.gameName);
    if (window.gameName) {
      require(`./games/${window.gameName}/index.js`);
    }
  });

  window.addEventListener('message', async (msg) => {
    if (typeof msg.data !== 'object') return;
    const { type, __script, gamesConfig } = msg.data;
    if (type && __script) {
      console.log('script:接受消息', msg.data, getNow());
      if (!window.gameName) {
        window.gameName = getQueryString('gamename');
      }
      window.gamesConfig = gamesConfig || {};
      window.__autoScriptHandlers.forEach((v) => v(msg.data));
    }
  });
}
