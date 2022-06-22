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
  const repirRet = await repir(rows, true);
  if (repirRet && !repirRet.success) {
    toast('维修失败！');
    rows = rows.filter(({ durability }) => durability);
  }
  const _tools = new Tools(rows);
  toast('执行挖矿');
  return await _tools[passes ? 'execAll' : 'exec']();
}
/**
 * 维修
 * @param {*} rows
 * @param {boolean} isAuto 是否是自动执行
 */
export async function repir(rows, isAuto) {
  console.log('run repir', rows, getNow());
  const comm = new Comm();
  if (!isAuto) {
    toast('执行维修');
    return comm.repir(rows);
  }
  const passes = await getPasses(window.mywax.userAccount);
  const { tools_repirType } = window.gamesConfig.diggers;
  // 选择mine之前维修
  if (tools_repirType === 1) {
    toast('执行维修');
    return comm[passes ? 'repirAll' : 'repir'](rows);
  } else {
    // 到0维修,就要判断哪个设备耐久度没了
    const needRows = rows.filter(({ durability }) => !durability);
    if (needRows.length) {
      toast('执行维修');
      return comm[passes ? 'repirAll' : 'repir'](needRows);
    }
  }
}

// 背包工具stake装备
export async function stake(rows) {
  console.log('run stake', rows, getNow());
  toast('穿戴装备');
  const owner = window.mywax.userAccount;
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
  toast('进行提现操作');
  const actions = [];
  rows.forEach((row) => {
    const quantities = Object.keys(row).reduce((ret, val) => {
      const amount = Number(row[val]).toFixed(4);
      if (amount > 0.001) {
        ret.push(`${amount} ${val}`);
      }
      return ret;
    }, []);
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: { owner: owner, quantities },
      name: 'withdraw'
    });
  });
  return wax_transact({
    actions
  });
}

/**
 * 充值
 * @param {array} rows
 */
export function deposit(rows) {
  console.log('run deposit', rows);
  const owner = window.mywax.userAccount;
  toast('进行充值操作');
  const actions = [];
  rows.forEach((row) => {
    const quantities = Object.keys(row).reduce((ret, val) => {
      const amount = Number(row[val]).toFixed(4);
      if (amount > 0.001) {
        ret.push(`${amount} ${val}`);
      }
      return ret;
    }, []);
    actions.push({
      account: 'diggerstoken',
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        from: owner,
        to: window.gameName,
        memo: 'deposit',
        // memo: 'wax脚本，联系方式WX：Xiong-Yang-Yang',
        quantities
      },
      name: 'transfers'
    });
  });
  return wax_transact({
    actions
  });
}

/**
 * 建造小推车
 * @param {array} rows
 * @returns
 */
export function build(rows) {
  console.log('run build', rows);
  const owner = window.mywax.userAccount;
  toast('进行建造操作');
  const actions = [];
  rows.forEach(() => {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        asset_owner: owner
      },
      name: 'build'
    });
  });
  return wax_transact({ actions });
}

/**
 * 推车-选择开始 长短
 * {row.isShort} true 短， false 长
 */
export function startjourney(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  for (const row of rows) {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        asset_owner: owner,
        short_j: row.isShort
      },
      name: 'startjourney'
    });
  }
  return wax_transact({ actions });
}

/**
 * 推车收获，次数满了执行
 * @param {*} rows
 */
export function claimjourney(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  for (const row of rows) {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        asset_owner: owner
      },
      name: 'claimjourney'
    });
  }
  return wax_transact({ actions });
}

/**
 * 开始推车
 */
export function pushTrolley(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  for (const row of rows) {
    actions.push({
      account: 'atomicassets',
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        from: owner,
        asset_ids: [row.asset_id],
        memo: 'push',
        to: window.gameName
      },
      name: 'transfer'
    });
  }
  return wax_transact({
    actions
  });
}

/**
 * 购买东西
 * @param {*} rows
 * @returns
 */
export function buy(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  for (const row of rows) {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        player: owner,
        template_id: row.template_id
      },
      name: 'buy'
    });
  }
  return wax_transact({
    actions
  });
}

/**
 * 赌的各种操作
 */

/**
 * 赌的第一步
 */
export async function unsafemine(rows) {
  const actions = [];
  const owner = window.mywax.userAccount;
  const { tools_betType } = window.gamesConfig.diggers;
  if (!tools_betType.length) return;
  toast('开始赌博');
  const risky = tools_betType[0] === 1;
  for (const row of rows) {
    actions.push({
      account: window.gameName,
      authorization: [{ actor: owner, permission: 'active' }],
      data: {
        asset_owner: owner,
        asset_id: row.asset_id,
        risky,
        signing_value: 0
      },
      name: 'unsafemine'
    });
  }
  await wax_transact({ actions });
  return revealresult(rows);
}

/**
 * 获取赌的第二部的actions
 * @param {*} rows
 * @returns
 */
function getRevealresultActions(row) {
  const owner = window.mywax.userAccount;
  return {
    account: window.gameName,
    name: 'revealresult',
    authorization: [{ actor: owner, permission: 'active' }],
    data: {
      asset_owner: owner,
      asset_id: row.asset_id
    }
  };
}

/**
 * 赌的第二步
 * @param {*} rows
 * @returns
 */
export function revealresult(rows) {
  const actions = [];
  for (const row of rows) {
    actions.push(getRevealresultActions(row));
  }
  return wax_transact({ actions });
}
