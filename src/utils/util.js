import { gamesConfig } from '@/store/light';
import axios from 'axios';
import { EOS_BASE_URLS, WAX_BASE_URLS } from './constant';

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

/**
 * 随机区间数
 * @param {number} min
 * @param {number} max
 * @returns
 */
export function randomRange(min = 0, max = 100) {
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 测试有用节点
 * @returns {string[]} 节点列表
 */
export function testingRpc(urls = WAX_BASE_URLS) {
  const all = urls.map((url) => {
    return axios.request({
      method: 'post',
      url: `${url}/v1/chain/get_info`,
      timeout: 10000
    });
  });
  return Promise.allSettled(all).then((res) =>
    res.filter((r) => r.value).map((r) => r.value.config.url.match(/https?:\/\/[^/]*/)[0])
  );
}
