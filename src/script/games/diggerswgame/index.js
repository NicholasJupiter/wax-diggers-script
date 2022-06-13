import { appendiFrame } from '@/script/preview';
import { toast } from '@/script/toast';
import { wax_login } from '@/script/wax/wax_event';
import { sendIframe } from '@s/msg';
import * as runFn from './handle_fn';
import * as waxjs from '@waxio/waxjs/dist';

// new wax
window.mywax = new waxjs.WaxJS({
  rpcEndpoint: 'https://diggersworld-wax-rpc.global.binfra.one'
});
setTimeout(() => {
  appendiFrame({
    collection_name: 'diggersworld'
  });
}, 2000);
toast('进行登录。。。');

wax_login();

window.__autoScriptHandlers.push((msg) => {
  const { data, type } = msg;
  if (type === 'run') {
    handler_run(data);
  }
});

/**
 * 运行
 * @param {*} data
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
