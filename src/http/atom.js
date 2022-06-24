import Axios from 'axios';
import { sleep } from '@/utils/time';
import { ASSETS_BASE_URLS } from '@/utils/constant';
import { randomRange } from '@/utils/util';

const axios = Axios.create({
  baseURL: ASSETS_BASE_URLS[0]
});

axios.interceptors.response.use(
  (res) => {
    if (res.data) {
      res.config.baseURL = ASSETS_BASE_URLS[randomRange(0, ASSETS_BASE_URLS.length - 1)];
      return res.data;
    }
    return res;
  },
  (err) => {
    const config = err.config;
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    // 如果是wax官方api就更改地址，防止某个url超时导致错误
    if (!ASSETS_BASE_URLS[config.__retryCount]) {
      config.__retryCount = 0;
    }
    config.url = config.url.replace(/https?:\/\/[^/]*/, '');
    config.baseURL = ASSETS_BASE_URLS[config.__retryCount];
    console.log(`url(${config.__retryCount}次)重试：${config.baseURL + config.url}`);
    // 返回重试请求
    return sleep(5000).then(() => axios(config));
  }
);
export default axios;
