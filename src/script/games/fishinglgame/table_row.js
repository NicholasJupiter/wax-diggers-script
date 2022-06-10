import { GetWaxTableRows } from '@/wax/table_row';

/**
 * table操作
 * @param {*} table
 * @param {*} _owner
 * @returns
 */
function waxTableRows(table, _owner) {
  const owner = _owner || window.mywax ? window.mywax.userAccount : '';
  return GetWaxTableRows({
    code: window.gameName,
    index_position: 1,
    json: true,
    key_type: '',
    limit: 100,
    lower_bound: owner,
    reverse: false,
    scope: window.gameName,
    show_payer: false,
    table,
    upper_bound: owner
  });
}

/**
 * 获取鱼
 * @returns
 */
export function getFishers() {
  return waxTableRows('fishers');
}

/**
 * 获取鱼饵
 * @returns
 */
export function getBaits() {
  return waxTableRows('baits');
}

/**
 * 获取安装中的鱼饵
 * @returns
 */
export async function getInUseBaits() {
  const ret = await waxTableRows('fisherbaits');
  if (ret.rows.length) {
    return ret.rows[0];
  }
  return null;
}
