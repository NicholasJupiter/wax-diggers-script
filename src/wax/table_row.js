import axios from '@/http/wax.js';
// import AtomAxios from '@/http/atom.js';
import { obser } from '@/store/light';
import { getBalancesObj } from '@/utils/util';
/**
 * 获取wax table_row资源
 * @param {object} rowData
 * @returns
 */
export async function GetWaxTableRows(rowData) {
  const data = {
    code: 'scope', // ! play game name
    index_position: 1,
    json: true,
    key_type: 'i64',
    limit: 100,
    lower_bound: 'waxName', // !
    reverse: false,
    scope: 'scope', // !
    show_payer: false,
    table: 'table', // !
    table_key: '',
    upper_bound: 'waxName' // !
  };
  if (rowData && typeof rowData === 'object') {
    Object.assign(data, rowData);
  }
  return axios.post('/v1/chain/get_table_rows', data);
}

/**
 * 获取钱包余额
 * @param {array} currencys
 * @returns
 */
export async function GetWalletBalances(currencys = [], code) {
  const { owner } = obser;
  const all = currencys.map((currency) => {
    return axios.post('/v1/chain/get_currency_balance', {
      code,
      account: owner,
      symbol: currency
    });
  });
  const ret = await Promise.all(all);
  const balances = ret.map((v) => v[0]);
  return getBalancesObj(balances);
  // return currencys.reduce((ret, currency) => {
  //   ret[currency] = walletRet.balances.find((v) => v.currency === currency)?.amount || 0;
  //   return ret;
  // }, {});
}

/**
 * 获取wax信息
 * @param {*} waxName
 * @returns
 */
export function GetWaxAccount(waxName) {
  return axios.post('/v1/chain/get_account', { account_name: waxName }).then((res) => {
    res.cpu_limit.calc =
      Math.ceil(((res.cpu_limit.max - res.cpu_limit.available) / res.cpu_limit.max) * 100) || 0;
    return res;
  });
}
