import { getBaits } from './table_row';

/**
 * 获取可以使用的鱼饵
 * @param {*} firstId 优先使用的id
 * @param {*} useAmount 使用的数量
 * @returns
 */
export async function getUseBaits(firstId, useAmount) {
  const baitsRet = await getBaits();
  const ret = {
    id: '',
    amount: 0
  };
  if (baitsRet.rows.length && baitsRet.rows[0].baits.length) {
    const { baits, amount } = baitsRet.rows[0];
    let i = 0;
    // 优先使用id
    if (baits.length > 1 && firstId) {
      i = baits.findIndex((v) => v === Number(firstId));
      // 存在数量
      if (amount[i]) {
        ret.id = baits[i];
        ret.amount = useAmount ? Math.min(amount[i], Number(useAmount)) : amount[i];
        return ret;
      }
    }
    for (let i = 0; i < baits.length; i++) {
      if (amount[i]) {
        ret.id = baits[i];
        ret.amount = useAmount ? Math.min(amount[i], Number(useAmount)) : amount[i];
        break;
      }
    }
    return ret;
  }
  return null;
}
