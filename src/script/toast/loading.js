import loadingImg from '@/assets/imgs/loading.gif';
import $ from 'jquery';
const loadingStyle = `
<style>
#_loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
  background: rgba(255,255,255,.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
#_loading >div{
  text-align:center;

}
#_loading >div>img{
  width: 120px;
}
</style>
`;

/**
 *
 */
export function showLoading(text, delay) {
  const el = $('#_loading');
  if (!el.length) {
    $('body').append(`
    ${loadingStyle}
    <div id="_loading">
      <div>
        <img src="${loadingImg}" />
        <p class="_loading-text">${text}</p>
      </div>
    </div>`);
  } else {
    el.show();
    el.find('._loading-text').text(text);
  }
  if (delay) {
    setTimeout(() => {
      closeLoading();
    }, delay);
  }
}

// 关闭
export function closeLoading() {
  $('#_loading').hide();
}
