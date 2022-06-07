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
