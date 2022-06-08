import { promiseTimeout } from '@/utils/time';
import { toast } from '../toast';

/**
 * wax 登录
 * @returns
 */
export async function wax_login() {
  try {
    const autoLogin = await window.mywax.isAutoLoginAvailable();
    if (autoLogin) {
      console.log('已登录...');
      return await window.mywax.login(window.gameName);
    }
    console.log('未登录..., 2分钟未登录 视为失败');
    return await promiseTimeout(window.mywax.login(window.gameName), 2 * 60000);
  } catch (e) {
    console.error('登录失败!!');
    return null;
  }
}

/**
 * 发送事件
 * @param {*} transaction
 * @returns
 */
export function wax_transact(transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      await wax_login();
      console.log('push', transaction);
      const result = await window.mywax.api.transact(transaction, {
        blocksBehind: 3,
        expireSeconds: 1200
      });
      console.log('push->执行成功：', result);
      toast('执行成功');
      resolve({
        success: true,
        transaction,
        data: result
      });
    } catch (e) {
      console.log('push->执行失败：', e.message, e);
      toast('执行失败');
      resolve({
        success: false,
        data: null,
        transaction,
        message: e.message
      });
    }
  });
}
