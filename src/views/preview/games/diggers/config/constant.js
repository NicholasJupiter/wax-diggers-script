export const COINS = {
  DWD: require('@/assets/imgs/coin/DWD.png'),
  DWI: require('@/assets/imgs/coin/DWI.png'),
  DWS: require('@/assets/imgs/coin/DWS.png')
};

export const ZH = {
  common: '常见',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
  pickaxe: '镐',
  bomb: '炸弹',
  jackhammer: '电钻'
};

/**
 * 获取中文
 * @param {*} str 
 * @returns 
 */
export function getZh(str) {
  return ZH[str] || str;
}
