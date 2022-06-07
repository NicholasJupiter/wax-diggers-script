/**  atom上的API调用 */
import axios from '@/http/atom';

/**
 * 获取游戏资源
 * @param {object} params
 * @returns
 */
export function getAsset(params) {
  return axios.get('atomicassets/v1/assets', {
    params: params
  });
}


// 获取market的东西
export function getAssetByMarket () {
  return axios.get('atomicmarket/v1/assets', {
    params: params
  });
}