import Axios from 'axios';
import { sleep } from '@/utils/time';

const axios = Axios.create({
  baseURL: 'https://wax.api.atomicassets.io'
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
    console.log(`自动重试Url: ${config.url}`, config);
    // 返回重试请求
    return sleep(5000).then(() => axios(config));
  }
);
export default axios;
