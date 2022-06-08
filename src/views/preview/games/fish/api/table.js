import { obser } from '@/store/light';
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
    lower_bound: _owner || owner,
    reverse: false,
    scope: gamename,
    show_payer: false,
    table,
    upper_bound: _owner || owner
  });
}

/**
 * 根据工具id查询工具
 * @returns
 */
export async function getToolsByToolId(asset_id) {
  const ret = waxTableRows('tools', asset_id);
  return ret;
}

/**
 * 查询用户
 * @returns {object} { tools:[] }
 */
export async function getAccounts() {
  const ret = await waxTableRows('accounts');
  return ret;
}
