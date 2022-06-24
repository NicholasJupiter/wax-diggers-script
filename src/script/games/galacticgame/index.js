import { sendIframe } from '@/script/msg';
import * as runFn from './handle_fn';

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
  await Promise.allSettled(ret);
  setTimeout(() => {
    sendIframe({
      type: 'reload'
    });
  }, 5000);
}
