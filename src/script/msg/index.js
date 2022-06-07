/**
 * 发送消息
 * @param {object} data { type:'', .... }
 * @returns
 */
export function sendIframe(data) {
  if (process.env.NODE_ENV === 'development') {
    window.postMessage({ ...data, __autoScript: true }, '*');
    return;
  }
  const iframe = document.querySelector('#wax-info iframe');
  if (iframe) {
    iframe.contentWindow.postMessage({ ...data, __autoScript: true }, '*');
  }
}
