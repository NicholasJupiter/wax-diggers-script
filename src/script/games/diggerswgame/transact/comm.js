import { wax_transact } from '@s/wax/wax_event.js';

/**
 * 公共函数
 */
class Comm {
  account = '';
  gameName = '';
  constructor() {
    this.account = window.mywax.userAccount;
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
