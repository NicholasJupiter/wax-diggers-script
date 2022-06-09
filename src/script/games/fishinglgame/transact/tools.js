import { toast } from '@/script/toast';
import { wax_transact } from '@s/wax/wax_event';
import { Comm } from './comm';

/**
 * 工具
 */
export default class Tools extends Comm {
  rows = [];
  constructor() {
    super();
  }
  /**
   * 执行操作
   * @param {object} rows
   */
  mine(row) {
    const transaction = {
      actions: []
    };
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
        bonus_asset_id: row.bonus_asset_id || 0,
        fisher_id: row.fisher_id,
        // asset_owner: this.account,
        // owner: this.account,
        fishername: this.account
      }
    });
    return wax_transact(transaction);
  }
}
