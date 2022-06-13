import { appendiFrame } from '@/script/preview';
import { sendIframe } from '@s/msg';
import { wax_login } from '@s/wax/wax_event';
import * as waxjs from '@waxio/waxjs/dist';
import * as runFn from './handle_fn';

window.__autoScriptHandlers.push((msg) => {
  const { data, type } = msg;
  if (type === 'run') {
    handler_run(data);
  }
});

window.mywax = new waxjs.WaxJS({
  rpcEndpoint: 'https://chain.wax.io'
});

setTimeout(() => {
  appendiFrame({
    collection_name: 'diggersworld'
  });
}, 2000);

toast('进行登录。。。');

wax_login();

/**
 * 监听
 */
async function handler_run(data) {
  // 循环
  const keys = Object.keys(data);
  const ret = [];
  for (const key of keys) {
    const rows = data[key];
    if (runFn[key] && rows.length) {
      ret.push(runFn[key](rows));
    }
  }
  await Promise.all(ret);
  setTimeout(() => {
    sendIframe({
      type: 'reload'
    });
  }, 5000);
}
