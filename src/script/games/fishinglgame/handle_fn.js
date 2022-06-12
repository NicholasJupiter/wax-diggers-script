import { toast } from '@/script/toast';
import { sleep } from '@/utils/time';
import { getFishers, getInUseBaits } from './table_row';
import { Bait } from './transact/bait';
import { Comm } from './transact/comm';
import Tools from './transact/tools';
import { getUseBaits } from './util';

/**
 * 工具处理
 * @param {*} rows
 */
export async function tools(rows) {
  toast('执行工具操作.');
  const tools = new Tools();
  const fishersRet = await getFishers();
  for (const row of rows) {
    if (fishersRet.rows.length) {
      row.fisher_id = fishersRet.rows[0].asset_id;
      if (!row.enegy) {
        await repir([row]);
      }
      const inUseBaits = await getInUseBaits();
      // 需要安装鱼饵
      if (!inUseBaits || !inUseBaits.bait_amount) {
        await stakeBait();
      }
      const mineRet = await tools.mine(row);
      if (!mineRet.success) {
        toast('执行失败！');
        console.log('执行失败！', mineRet);
        // 需要维修
        // if (mineRet.message.includes('estimated CPU time (0 us)')) {
        //   await repir([row]);
        // }
        // 安装鱼饵
        if (mineRet.message.includes('You must install the bait')) {
          await stakeBait();
        }
      }
    }
  }
}

/**
 * 安装鱼饵
 */
export async function stakeBait(rows) {
  toast('安装鱼饵。。。');
  const bait = new Bait();
  if (rows) {
    const { baitId, amount } = rows[0];
    toast(`使用鱼饵: id: ${baitId}, amount: ${amount}`);
    return await bait.stake(amount, baitId);
  }
  const { useBaitAmount, useBaitId } = window.gamesConfig.fishing;
  let useBaits = await getUseBaits(useBaitId, useBaitAmount);
  // 没有鱼饵了 需要购买
  if (!useBaits || !useBaits.amount) {
    await buyBait();
    await sleep(2000);
    useBaits = await getUseBaits(useBaitId, useBaitAmount);
  }
  if (useBaits && useBaits.amount) {
    toast(`使用鱼饵: id: ${useBaits.id}, amount: ${useBaits.amount}`);
    await bait.stake(useBaits.amount, useBaits.id);
  }
}

/**
 * 购买鱼饵
 */
export function buyBait(rows) {
  toast('购买鱼饵。。');
  let buyBaitId, buyBaitAmount;
  if (rows) {
    buyBaitId = rows[0].buyBaitId;
    buyBaitAmount = rows[0].buyBaitAmount;
  } else {
    buyBaitId = window.gamesConfig.fishing.buyBaitId;
    buyBaitAmount = window.gamesConfig.fishing.buyBaitId;
  }
  const bait = new Bait();
  return bait.buy(Number(buyBaitAmount), Number(buyBaitId));
}

/**
 * 维修
 * @param {array} row
 * @returns
 */
export function repir(rows) {
  toast('进行维修');
  const comm = new Comm();
  return comm.repir(rows);
}

/**
 * 提现
 * @param {array} rows
 */
export function withdraw(rows) {
  console.log('run withdraw', rows);
  const owner = window.mywax.userAccount;
  const gameName = window.gameName;
  toast('提现');
  const all = [];
  rows.forEach((row) => {
    const quantities = Object.keys(row).reduce((ret, val) => {
      const amount = Number(row[val]).toFixed(4);
      ret.push(`${amount} ${val}`);
      return ret;
    }, []);
    all.push(
      wax_transact({
        actions: [
          {
            account: gameName,
            authorization: [{ actor: owner, permission: 'active' }],
            data: { owner: owner, assets: quantities },
            name: 'withdraw'
          }
        ]
      })
    );
  });
  return Promise.all(all);
}

/**
 * 充值
 * @param {array} rows
 */
export function deposit(rows) {
  console.log('run withdraw', rows);
  const owner = window.mywax.userAccount;
  const gameName = window.gameName;
  toast('充值操作');
  const all = [];
  rows.forEach((row) => {
    const quantities = Object.keys(row).reduce((ret, val) => {
      const amount = Number(row[val]).toFixed(4);
      if (amount > 0.001) {
        ret.push(`${amount} ${val}`);
      }
      return ret;
    }, []);
    all.push(
      wax_transact({
        actions: [
          {
            account: 'fishingcoins',
            authorization: [{ actor: owner, permission: 'active' }],
            data: {
              from: owner,
              to: gameName,
              memo: 'deposit',
              // memo: 'wax脚本，联系方式WX：Xiong-Yang-Yang',
              quantities
            },
            name: 'transfers'
          }
        ]
      })
    );
  });
  return Promise.all(all);
}
