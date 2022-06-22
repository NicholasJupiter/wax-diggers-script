import { getNow } from '@/utils/time';
import { wax_login, wax_transact } from './wax/wax_event';
import { toast } from './toast/index';
import { getQueryString, randomRange, testingRpc } from '@/utils/util';
import * as waxjs from '@waxio/waxjs/dist';
import { closeLoading, showLoading } from './toast/loading';
import { WAX_BASE_URLS } from '@/utils/constant';

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

  window.addEventListener('load', async () => {
    console.log(process.env, window.gameName);
    if (window.gameName) {
      showLoading('加载可用rpc节点中...');
      // const urls = [1];
      const urls = await testingRpc(WAX_BASE_URLS);
      closeLoading();
      if (urls.length) {
        window.__waxUrls = urls;
        // new wax
        window.mywax = new waxjs.WaxJS({
          rpcEndpoint: urls[randomRange(0, urls.length - 1)]
          // rpcEndpoint: WAX_BASE_URLS[0]
          // rpcEndpoint: 'https://wax.hivebp.io'
        });
        require(`./games/${window.gameName}/index.js`);
      } else {
        alert('所有eos rpc节点访问失败，请更换vpn节点并刷新界面');
      }
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
