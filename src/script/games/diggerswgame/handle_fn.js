import { getPasses } from './table_row';
import { Comm } from './transact/comm';
import Tools from './transact/tools';
import { getNow } from '@/utils/time';
import { wax_transact } from '@s/wax/wax_event';
import { toast } from '@s/toast';

/**
 * 工具
 * @param {*} rows
 * @returns
 */
export async function tools(rows) {
  console.log('run tools', rows, getNow());
  const account = rows[0].account;
  const passes = await getPasses(account);
  await repir(rows, 1);
  const _tools = new Tools(rows);
  toast('执行挖矿');
  return await _tools[passes ? 'execAll' : 'exec']();
}
/**
 * 维修
 * @param {*} rows
 */
export async function repir(rows, isMine) {
  console.log('run repir', rows, getNow());
  const account = rows[0].account;
  const comm = new Comm(account);
  if (!isMine) {
    toast('执行维修');
    return await comm.repir(rows);
  }
  const passes = await getPasses(account);
  const { repirType } = window.gamesConfig.diggers;
  // 选择mine之前维修
  if (repirType === 1) {
    toast('执行维修');
    await comm[passes ? 'repirAll' : 'repir'](rows);
  } else {
    // 到0维修,就要判断哪个设备耐久度没了
    const needRows = rows.filter(({ durability }) => !durability);
    if (needRows.length) {
      toast('执行维修');
      await comm[passes ? 'repirAll' : 'repir'](needRows);
    }
  }
}

// 背包工具stake装备
export async function stake(rows) {
  console.log('run stake', rows, getNow());
  toast('穿戴装备');
  const owner = rows[0].owner;
  const asset_ids = rows.map((v) => v.asset_id);
  return await wax_transact({
    actions: [
      {
        account: 'atomicassets',
        authorization: [{ actor: owner, permission: 'active' }],
        data: { from: owner, to: 'diggerswgame', asset_ids, memo: 'stake' },
        name: 'transfer'
      }
    ]
  });
}

// 卸下装备
export async function unstake(rows) {
  console.log('run unstake', rows, getNow());
  toast('卸下装备');
  const owner = rows[0].account;
  const asset_id = rows[0].asset_id;
  return await wax_transact({
    actions: [
      {
        account: window.gameName,
        authorization: [{ actor: owner, permission: 'active' }],
        data: { asset_owner: owner, asset_id },
        name: 'unstake'
      }
    ]
  });
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
      if (amount > 0.001) {
        ret.push(`${amount} ${val}`);
      }
      return ret;
    }, []);
    all.push(
      wax_transact({
        actions: [
          {
            account: gameName,
            authorization: [{ actor: owner, permission: 'active' }],
            data: { owner: owner, quantities },
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
            account: 'diggerstoken',
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
