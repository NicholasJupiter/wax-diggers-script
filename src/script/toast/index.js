import $ from 'jquery';

const toastStyle = `
<style class="auto-toast-style">
#toast-list {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999999;
  max-width: 250px;
}

.auto-toast {
  background-color: #333;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.auto-toast + .auto-toast{
  margin-top: 12px;
}
.auto-toast > .content {
  color: white;
  font-size: 16px;
}

</style>

<div id="toast-list">
</div>


`;

/**
 * 消息
 * @param {string} msg 
 * @param {number} time 
 */
export function toast(msg, delay = 2000) {
  if (!$('.auto-toast-style').length) {
    $(toastStyle).appendTo('body');
  }
  const toastContainer = $('#toast-list');
  const time = Date.now();
  $(`
  <div class="auto-toast" data-id="${time}">
    <div class="content">${msg}</div>
  </div>`).appendTo(toastContainer);

  setTimeout(() => {
    $(`.auto-toast[data-id='${time}']`).remove();
  }, delay);
}

