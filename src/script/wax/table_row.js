import axios from '@/http/wax';
const talbeBaseUrl = 'https://chain.wax.io/v1/chain/get_table_rows';

export const table_name = {
  accounts: 'accounts' // 用户
};

/**
 * 获取wax table_row资源
 * @param {string} waxName
 * @param {string} scope 游戏名称
 * @param {string} table 需要获取的数据类型
 * @returns
 */
export async function GetWaxTableRows(rowData) {
  const data = {
    code: 'scope', // !
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
  return axios.post(talbeBaseUrl, data);
}

/**
 * 获取通行证
 * @returns
 */
export async function getPasses(account) {
  // const waxName = window.mywax.userAccount;
  const ids = [494331];
  return await GetWaxTableRows({
    upper_bound: account,
    lower_bound: account,
    scope: window.gameName,
    code: window.gameName,
    table: 'passes'
  }).then((res) => {
    if (!res.rows.length) {
      return null;
    }
    return res.rows.find(({ template_id }) => ids.includes(template_id));
  });
}
