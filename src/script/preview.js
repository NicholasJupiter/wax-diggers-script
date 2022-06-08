import { queryParams } from '@/utils/util';
import $ from 'jquery';
import { toast } from './toast';

const iframeStyle = `.waxinfo {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: white;
  z-index: 999999;
  width: 70vw;
  transition: 0.3s transform;
  transform: translateX(100%);
}

.waxinfo.open {
  transform: translateX(0);
}
.waxinfo > button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  border-radius: 6px;
  padding: 4px 8px;
  outline: 0;
  background-color: #a0735f;
  font-size: 24px;
  color: white;
}

.waxinfo > iframe {
  width: 100%;
  height: 100%;
}
`;

/**
 * 添加iframe
 */
export function appendiFrame(params) {
  // const path = 'http://localhost:5000/#/preview?waxname=';
  if (!window.mywax || !window.mywax.userAccount) {
    console.log('未检测到登录!');
    setTimeout(() => {
      appendiFrame(params);
    }, 10000);
    return;
  }
  toast('脚本运行成功!');
  let src =
    process.env.iframeUrl +
    queryParams({
      ...params,
      waxname: window.mywax.userAccount,
      gamename: window.gameName
    });

  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境, src=', src, params);
    return;
  }
  $('body').append(`
        <style>${iframeStyle}</style>
        <div class="waxinfo open" id="wax-info">
          <button onclick="openiFrame()">打开</button>
          <iframe src='${src}' ></iframe>
        </div>
    `);

  window.openiFrame = function () {
    const el = document.querySelector('.waxinfo');
    if (el.classList.contains('open')) {
      el.querySelector('button').innerText = '打开';
      el.classList.remove('open');
    } else {
      el.querySelector('button').innerText = '关闭';
      el.classList.add('open');
    }
  };
}
