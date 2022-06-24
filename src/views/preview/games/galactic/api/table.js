import { obser } from '@/store/light';
import { getBalancesObj } from '@/utils/util';
import { GetWaxTableRows } from '@/wax/table_row';

/**
 * table操作
 * @param {*} table
 * @param {*} _owner
 * @returns
 */
function waxTableRows(table, _owner) {
  const { owner, gamename } = obser;
  return GetWaxTableRows({
    code: gamename,
    index_position: 1,
    json: true,
    key_type: '',
    limit: 100,
    lower_bound: _owner ?? owner,
    reverse: false,
    scope: gamename,
    show_payer: false,
    table,
    upper_bound: _owner ?? owner
  });
}

/**
 * 获取工具
 * @returns
 */
export function getTools() {
  const { owner, gamename } = obser;
  return GetWaxTableRows({
    code: gamename,
    encode_type: 'json',
    json: true,
    key_type: 'string',
    limit: 10,
    reverse: false,
    scope: owner,
    show_payer: false,
    table: 'slots',
    lower_bound: '',
    upper_bound: ''
  }).then((res) => {
    return res.rows.filter((v) => v.pid && v.sid);
  });
}

/**
 * 根据工具id查询工具
 * @returns
 */
export async function getToolsByToolId(asset_id) {
  return waxTableRows('tools', asset_id);
}

/**
 * 查询用户
 * @returns {object} { tools:[] }
 */
export function getAccounts() {
  return waxTableRows('accounts');
}

/**
 * 获取用户背包的鱼饵
 */
export function getUserBaits() {
  return waxTableRows('baits');
}

/**
 * 获取使用中的鱼饵
 */
export async function getInUseBaits() {
  const ret = await waxTableRows('fisherbaits');
  if (ret.rows.length) {
    return ret.rows[0];
  }
  return null;
}

/**
 * 获取用户余额
 * @returns
 */
export async function getUserBalances() {
  const ret = await getAccounts();
  if (ret && ret.rows.length) {
    return getBalancesObj(ret.rows[0].balances);
  }
  return null;
}
