import { obser } from '@/store/light';
import { GetWaxTableRows } from '@/wax/table_row';
import { getZh } from '../config/constant';

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
 * 获取用户余额
 * @returns
 */
export async function getUserBalances() {
  const ret = await _getWaxTableRows('userbalance');
  if (ret.rows.length) {
    return ret.rows[0].balance;
  }
  return null;
}

/**
 * 获取所有道具
 * @param {string} gamename
 */
export async function GetAllProp() {
  const res = await _getWaxTableRows('toolsconfig', '');
  res.rows.forEach((v) => {
    const { template_name, rarity } = v;
    v.__name = `${getZh(template_name)} ${getZh(rarity)}`;
  });
  return res.rows;
}
