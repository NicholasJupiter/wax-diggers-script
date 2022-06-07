// 睡觉
export function sleep(time = 0) {
  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, time)
  );
}

/**
 * 超时promise
 * @param {Promise} promise
 * @param {number} delay
 * @returns
 */
export function promiseTimeout(promise, delay) {
  let timeout = new Promise((_, reject) => {
    setTimeout(function () {
      reject('超时啦~');
    }, delay);
  });
  return Promise.race([timeout, promise]);
}

/**
 * 获取当前时间
 * @returns {string}
 */
export function getNow() {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * 计算时间差
 * @param {*} nextTime
 * @returns
 */
export function getDifferenceTime(nextTime) {
  let nowTime = Date.now(); //获取当前时间对应的毫秒数
  let eightTime = new Date(nextTime).getTime(); //获取八点对应的毫秒数
  let differenceTime = nowTime - eightTime;
  if (differenceTime <= 0) {
    return '00:00:00';
  } else {
    let diffDate = new Date(differenceTime - 8 * 60 * 60 * 1000);
    let hours = diffDate.getHours();
    let minutes = diffDate.getMinutes();
    let seconds = diffDate.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
}
