import * as waxjs from '@waxio/waxjs/dist';
import { wax_login } from '@/script/wax/wax_event';
import { getAsset } from '@/wax/atom_asset';
import { transferCoin } from './transfer';
import { promiseTimeout } from '@/utils/time';

if (typeof window === 'object') {
  window.addEventListener('load', () => {
    console.log('farmers coins');
    setTimeout(async () => {
      // new wax
      window.mywax = new waxjs.WaxJS({
        rpcEndpoint: 'https://wax.greymass.com'
      });
      await wax_login();
      console.log('login in');
      if (process.env.NODE_ENV === 'development') {
        // const ret = await getCoins(window.mywax.userAccount);
        // const asset_ids = ret.map((v) => v.asset_id);
        // transferCoin(window.mywax.userAccount, asset_ids);
      } else {
        loopDepositCoins();
      }
    }, 2000);
  });
}

/**
 * 循环提取
 */
async function loopDepositCoins() {
  if (!window.mywax.userAccount) {
    setTimeout(() => {
      loopDepositCoins();
    }, 5000);
    return;
  }
  try {
    console.log('执行');
    const ret = await getCoins(window.mywax.userAccount);
    const asset_ids = ret.map((v) => v.asset_id);
    await promiseTimeout(transferCoin(window.mywax.userAccount, asset_ids), 60000);
  } catch (error) {}
  setTimeout(() => {
    loopDepositCoins();
  }, 5000);
}

/**
 * 获取农夫币
 * @param {string} owner
 */
async function getCoins(owner) {
  const ret = await getAsset({
    page: 1,
    limit: 50,
    owner,
    collection_name: 'farmersworld',
    schema_name: 'farmercoins'
  });
  return ret.data;
}
