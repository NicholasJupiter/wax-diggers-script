import { wax_transact } from '@/script/wax/wax_event';

export function mine(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  for (const row of rows) {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        ind: row.key,
        nm: owner
      },
      name: 'mine'
    });
  }
  return wax_transact({ actions });
}
