import Axios from 'axios';
import { sleep } from '@/utils/time';
import { EOS_BASE_URLS } from '@/utils/constant';

const axios = Axios.create({
  baseURL: 'https://wax.cryptolions.io'
});

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

    // 如果是wax官方api就更改地址，防止某个url超时导致错误
    if (config.url.includes('/v1/chain/')) {
      if (!EOS_BASE_URLS[config.__retryCount]) {
        config.__retryCount = 0;
      }
      config.url = config.url.replace(/https?:\/\/[^\/]*/g, EOS_BASE_URLS[config.__retryCount]);
    }
    console.log(config.url + ' 自动重试第' + config.__retryCount + '次');
    // 返回重试请求
    return sleep(5000).then(() => axios(config));
  }
);
export default axios;
