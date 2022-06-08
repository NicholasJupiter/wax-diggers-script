import { toast } from '@/script/toast';
import { wax_transact } from '@s/wax/wax_event';
import { Comm } from './comm';

/**
 * 工具
 */
export default class Tools extends Comm {
  rows = [];
  constructor(_rows) {
    super();
    this.rows = _rows;
  }
  /**
   * 执行操作
   * @param {string} fisher_id 鱼的id
   * @param {number} bonus_asset_id 0 不知道是什么
   */
    mine(fisher_id, bonus_asset_id = 0) {
    const transaction = {
      actions: []
    };
    for (const row of this.rows) {
      transaction.actions.push({
        account: this.gameName,
        name: 'fishing',
        authorization: [
          {
            actor: this.account,
            permission: 'active'
          }
        ],
        data: {
          asset_id: row.asset_id,
          bonus_asset_id,
          fisher_id,
          // asset_owner: this.account,
          // owner: this.account,
          fishername: this.account
        }
      });
    }
    return wax_transact(transaction);
  }
}
