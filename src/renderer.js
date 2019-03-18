import { ipcRenderer } from 'electron';

import Vue from 'vue';

var vm = new Vue({
  el: '#sample',
  data: {
    message: 'Hello, World!!'
  }
});

// 非同期(Renderer)
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // pong
})
ipcRenderer.send('asynchronous-message', 'ping1')