import { gamesConfig } from "@/store/light";

/**
 * 序列化参数
 * @param {*} params
 * @returns
 */
export function queryParams(params = {}) {
  return Object.keys(params).reduce((v, key) => {
    return v + `${key}=${params[key]}&`;
  }, '?');
}

/**
 * 参数获取
 * @param {*} variable
 * @returns
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let search = window.location.search;
  if (!search && location.hash) {
    search = location.hash.substring(location.hash.indexOf('?'));
  }
  let r = search.substring(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

/**
 * 获取计算后的余额对象
 * @param {*} balances
 */
export function getBalancesObj(balances = []) {
  if (balances && balances.length) {
    const ret = {};
    balances.forEach((v) => {
      const [amount, currency] = v.split(' ');
      ret[currency] = Number(amount);
    });
    return ret;
  }
  return {};
}

/**
 * 发送消息
 * @param {object} msg 消息 { type: 'run',  data: { [type: string]: [row] } }
 */
export function sendMessage(msg) {
  const data = { __script: true, ...msg, gamesConfig: { ...gamesConfig } };
  console.log('send message....', data);
  try {
    window.postMessage(data, '*');
  } catch (error) {}
  if (window.parent !== window.self) {
    window.parent.postMessage(data, '*');
    return;
  }
}
