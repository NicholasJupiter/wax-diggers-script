import { wax_transact } from '@s/wax/wax_event';
import { Comm } from './comm';

/**
 * 工具
 */
export default class Tools extends Comm {
  rows = [];
  constructor(_rows) {
    super(_rows[0].account);
    this.rows = _rows;
  }

  /**
   * 通行证所有点击
   */
  async execAll() {
    const transaction = {
      actions: [
        {
          account: this.gameName,
          name: 'mineall',
          authorization: [
            {
              actor: this.account,
              permission: 'active'
            }
          ],
          data: {
            asset_owner: this.account,
            owner: this.account,
            asset_ids: this.rows.map((v) => v.asset_id)
          }
        }
      ]
    };
    return await wax_transact(transaction);
  }
  /**
   * 执行操作
   */
  async exec() {
    const transaction = {
      actions: []
    };
    for (const row of this.rows) {
      transaction.actions.push({
        account: this.gameName,
        name: 'safemine',
        authorization: [
          {
            actor: this.account,
            permission: 'active'
          }
        ],
        data: {
          asset_id: row.asset_id,
          asset_owner: this.account,
          owner: this.account
        }
      });
    }
    return await wax_transact(transaction);
  }
}
