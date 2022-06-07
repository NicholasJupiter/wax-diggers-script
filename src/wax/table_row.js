import axios from '@/http/wax.js';

const talbeBaseUrl = 'https://chain.wax.io/v1/chain/get_table_rows';

/**
 * 获取wax运行资源
 * @param {string} waxName
 * @returns
 */
// export async function GetWaxTableRows(waxName, table, scope) {
//   return await axios.post(talbeBaseUrl, {
//     code: scope,
//     index_position: 2,
//     json: true,
//     key_type: 'i64',
//     limit: 100,
//     lower_bound: waxName,
//     reverse: false,
//     scope: scope,
//     show_payer: false,
//     table: table,
//     table_key: '',
//     upper_bound: waxName
//   });
// }

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
  return axios.post(talbeBaseUrl, data);
}

/**
 * 获取余额
 * @param {*} waxName
 * @returns
 */
export function GetAlcorBalances(waxName) {
  return axios.get('https://lightapi.eosamsterdam.net/api/balances/wax/' + waxName);
}

/**
 * 获取wax信息
 * @param {*} waxName
 * @returns
 */
export function GetWaxAccount(waxName) {
  return axios
    .post('https://chain.wax.io/v1/chain/get_account', { account_name: waxName })
    .then((res) => {
      res.cpu_limit.calc =
        Math.ceil(((res.cpu_limit.max - res.cpu_limit.available) / res.cpu_limit.max) * 100) || 0;
      return res;
    });
}

/**
 * 获取所有道具
 * @param {string} gamename
 */
export async function GetAllProp(gamename) {
  return await GetWaxTableRows({
    code: gamename,
    index_position: 1,
    scope: gamename,
    table: 'toolsconfig',
    lower_bound: '',
    upper_bound: ''
  }).then((res) => {
    res.rows.forEach((v) => {
      const { template_name, rarity } = v;
      v.__name = `${template_name} ${rarity}`;
    });
    return res.rows;
  });
}
