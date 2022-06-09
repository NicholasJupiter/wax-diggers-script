import moment from 'moment';

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
  const now = moment();
  const next = moment(nextTime);
  const diff = moment.duration(next - now);
  const hh = diff.hours(),
    mm = diff.minutes(),
    ss = diff.seconds();

  let text = `${padStartZero(hh)}:${padStartZero(mm)}:${padStartZero(ss)}`;
  let zero = now.unix() >= next.unix(); // 倒计时结束
  return {
    hh,
    mm,
    ss,
    text: zero ? '00:00:00' : text,
    zero
  };
}

/**
 * 往前补0
 * @param {*} str
 * @returns
 */
export function padStartZero(str) {
  return String(str).padStart(2, '0');
}
