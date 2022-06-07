import { getNow } from '@/utils/time.js';
import { GetWaxTableRows } from '../table_row.js';
import { wax_transact } from '../wax_event.js';

/**
 * 获取体力
 * @param {string} account 用户名称
 * @returns {Object} { maxEnergy: 最大体力, energy: 当前体力, diffEnergy: 需要补充的体力 }
 */
async function getEnergy(account) {
  const ret = {
    energy: 0,
    maxEnergy: 0,
    diffEnergy: 0
  };
  await GetWaxTableRows(account, window.gameName, accounts).then((res) => {
    const balanceFood = res.balances.find((v) => v.includes('FOOD'));
    let currFood = 0;
    if (balanceFood) {
      currFood = parseInt(balanceFood.split(' ')[0]);
    }
    if (currFood < 20) {
      throw new Error('食物不足。。。。');
    }
    const currEnergy = res.energy;
    const maxEnergy = res.max_energy;
    let diffEnergy = maxEnergy - currEnergy;
    if (diffEnergy / 5 > currFood) {
      diffEnergy = currFood * 5;
    }
    ret.energy = currEnergy;
    ret.maxEnergy = maxEnergy;
    ret.diffEnergy = parseInt(diffEnergy);
  });
  return ret;
}
/**
 * 补充体力
 */
export async function refuelEnergy(account) {
  console.log('开始补充体力', getNow());
  const energy = await getEnergy(account);
  console.log('需要补充:' + energy.diffEnergy, getNow());
  const transaction = {
    actions: [
      {
        account: window.gameName,
        name: 'recover',
        authorization: [
          {
            actor: account,
            permission: 'active'
          }
        ],
        data: {
          energy_recovered: energy.diffEnergy,
          owner: account
        }
      }
    ]
  };
  return await wax_transact(transaction);
  // .then((res) => {
  //   if (res.success) {
  //     console.log('补充体力成功', window.getNow());
  //     return res;
  //   } else {
  //     console.warn('补充体力失败', window.getNow());
  //     const backoff = new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve();
  //       }, 5000);
  //     });
  //     return backoff.then(refuelEnergy);
  //   }
  // });
}

/**
 * 公共函数
 */
class Comm {
  account = '';
  gameName = '';
  constructor(account) {
    this.account = account;
    this.gameName = window.gameName;
  }

  /**
   * 维修多个设备
   * @param {array} rows
   * @returns
   */
  async repir(rows) {
    const transaction = {
      actions: []
    };
    for (const row of rows) {
      transaction.actions.push({
        account: this.gameName,
        name: 'trepair',
        authorization: [
          {
            actor: row.account,
            permission: 'active'
          }
        ],
        data: {
          asset_id: row.asset_id,
          asset_owner: row.account
        }
      });
    }
    return await wax_transact(transaction);
  }

  /**
   * 所有维修
   * @param {array} rows
   * @returns
   */
  async repirAll(rows) {
    const transaction = {
      actions: [
        {
          account: this.gameName,
          name: 'repairall',
          authorization: [
            {
              actor: this.account,
              permission: 'active'
            }
          ],
          data: {
            asset_owner: this.account,
            owner: this.account,
            asset_ids: rows.map((v) => v.asset_id)
          }
        }
      ]
    };
    return await wax_transact(transaction);
  }
}

export { Comm };
