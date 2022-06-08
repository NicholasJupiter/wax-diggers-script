import { wax_transact } from '@/script/wax/wax_event';
import { getBaits } from '../table_row';
import { Comm } from './comm';

export class Bait extends Comm {
  constructor() {
    super();
    // this.rows = getBaits();
  }
  /**
   * 装备鱼饵
   * @param {number} useAmount 使用数量
   * @param {string} id 使用的id
   * @returns
   */
  stake(useAmount, id) {
    const transaction = {
      actions: []
    };
    transaction.actions.push({
      name: 'setbait',
      account: this.gameName,
      authorization: this.authorization,
      data: {
        amount: useAmount,
        owner: this.account,
        id
      }
    });

    return wax_transact(transaction);
  }

  /**
   * 购买鱼饵
   * @param {*} amount
   * @param {*} template_id
   * @returns
   */
  buy(amount, template_id) {
    const transaction = {
      actions: []
    };
    transaction.actions.push({
      name: 'craftitem',
      account: this.gameName,
      authorization: this.authorization,
      data: {
        amount,
        owner: this.account,
        template_id
      }
    });
    return wax_transact(transaction);
  }
}
