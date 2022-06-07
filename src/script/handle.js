import { getQueryString } from '@/utils/util';
import * as run from './handle_fn';

/**
 * 运行
 * @param {*} data
 */
export async function ExecRun(msg = {}) {
  const { data, waxConfig } = msg;
  if (!window.gameName) {
    window.gameName = getQueryString('gamename');
  }
  window.waxConfig = waxConfig || {};
  // 循环
  const keys = Object.keys(data);
  const ret = [];
  for (const key of keys) {
    const rows = data[key];
    if (run[key] && rows.length) {
      ret.push(run[key](rows));
    }
  }
  await Promise.all(ret);
}

// const run = {
//   tools: tools,
//   repir: repir,
//   stake: stake
// };
