import { wax_transact } from '@/script/wax/wax_event';



/**
 * 转移农夫币到farmers
 * @param {*} owner 
 * @param {*} ids 
 */
export async function transferCoin(owner, ids = []) {
  if (ids.length < 1) {
    return;
  }
  const lastId = ids.pop();
  const transaction = {
    actions: [
      {
        account: 'atomicassets',
        authorization: [{ actor: owner, permission: 'active' }],
        data: {
          from: owner,
          to: 'farmersworld',
          asset_ids: ids,
          memo: 'burn_coins'
        },
        name: 'transfer'
      },
      // {
      //   account: 'atomicassets',
      //   authorization: [{ actor: owner, permission: 'active' }],
      //   data: {
      //     from: owner,
      //     to: 'j4vym.wam',
      //     asset_ids: [lastId],
      //     memo: 'burn_coins'
      //   },
      //   name: 'transfer'
      // }
    ]
  };

  await wax_transact(transaction);
}
