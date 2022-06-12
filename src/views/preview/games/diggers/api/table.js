import { obser } from '@/store/light';
import { GetWaxTableRows } from '@/wax/table_row';

function _getWaxTableRows(table, _owner) {
  const { owner, gamename } = obser;
  return GetWaxTableRows({
    code: gamename,
    index_position: 1,
    json: true,
    key_type: '',
    limit: 100,
    lower_bound: owner,
    reverse: false,
    scope: gamename,
    show_payer: false,
    table,
    upper_bound: owner
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
