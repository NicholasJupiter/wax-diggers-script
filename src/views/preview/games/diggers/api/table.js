import { obser } from '@/store/light';
import { getBalancesObj } from '@/utils/util';
import { GetWaxTableRows } from '@/wax/table_row';
import { getZh } from '../config/constant';

// 内置使用
function _getWaxTableRows(table, _owner) {
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
 * 获取用户工具
 * @returns
 */
export function getUserTools() {
  const { owner, gamename } = obser;
  return GetWaxTableRows({
    lower_bound: owner,
    index_position: 2,
    upper_bound: owner,
    table: 'tools',
    scope: gamename,
    code: gamename
  });
}

/**
 * 获取手推车
 * @returns
 */
export function getUserTrolley() {
  const { owner, gamename } = obser;
  return GetWaxTableRows({
    lower_bound: owner,
    index_position: 1,
    upper_bound: owner,
    table: 'trolley',
    scope: gamename,
    code: gamename
  });
}

/**
 * 获取用户余额
 * @returns
 */
export async function getUserBalances() {
  const ret = await _getWaxTableRows('userbalance');
  if (ret.rows.length) {
    return getBalancesObj(ret.rows[0].balance);
  }
  return null;
}

/**
 * 获取所有道具
 * @param {string} gamename
 */
export async function GetAllTools() {
  const res = await _getWaxTableRows('toolsconfig', '');
  res.rows.forEach((v) => {
    const { template_name, rarity, repair_cost, init_durability } = v;
    const obj = getBalancesObj(repair_cost);
    v.repair_once = {};
    Object.keys(obj).forEach((key) => {
      if (Number(obj[key])) {
        v.repair_once[key] = Number(obj[key]) / init_durability;
      }
    });
    v.__name = `${getZh(template_name)} ${getZh(rarity)}`;
  });
  return res.rows;
}

/**
 * 获取所有rush元素，里面包括手推车
 */
export async function GetAllRushConfig() {
  const { gamename } = obser;
  const ret = await GetWaxTableRows({
    code: gamename,
    index_position: 1,
    json: true,
    key_type: '',
    limit: 100,
    lower_bound: null,
    reverse: false,
    scope: gamename,
    show_payer: false,
    table: 'rushconfig',
    upper_bound: null
  });
  if (ret.rows) {
    ret.rows.forEach((row) => {
      row._build_price = getBalancesObj(row.build_price);
      row._long_reward = getBalancesObj(row.long_reward);
      row._short_reward = getBalancesObj(row.short_reward);
    });
    return ret.rows;
  }
  return [];
}
