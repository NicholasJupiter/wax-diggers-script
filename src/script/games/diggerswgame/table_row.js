import { GetWaxTableRows } from '@/wax/table_row';

export const table_name = {
  accounts: 'accounts' // 用户
};
/**
 * 获取通行证
 * @returns
 */
export async function getPasses(owner) {
  const ids = [494331];
  return await GetWaxTableRows({
    upper_bound: owner,
    lower_bound: owner,
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
