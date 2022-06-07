import Axios from 'axios';
import { sleep } from '@/utils/time';

const axios = Axios.create({
  baseURL: 'https://wax.api.atomicassets.io'
});

const baseurls = ['https://wax.api.atomicassets.io'];

axios.interceptors.response.use(
  (res) => {
    if (res.data) {
      return res.data;
    }
    return res;
  },
  (err) => {
    const config = err.config;
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;

    if (config.url.includes('/v1/asset/')) {
      if (!baseurls[config.__retryCount]) {
        console.log('不存在地址, 从索引0开始。');
        config.__retryCount = 0;
      }
      config.url = config.url.replace(/https?:\/\/[^\/]*/g, baseurls[config.__retryCount]);
    }

    console.log(config.url + ' 自动重试第' + config.__retryCount + '次');
    console.log('重试请求', config);
    // 返回重试请求
    return sleep(5000).then(() => axios(config));
  }
);
export default axios;
