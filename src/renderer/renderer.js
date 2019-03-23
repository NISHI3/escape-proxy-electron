import {ipcRenderer} from 'electron';

import Vue from 'vue';
import MainTag from "../components/Main";

import "../style/main.scss"

var vm = new Vue({
    el: '#main',
    components: {'main-tag': MainTag},
});

// 非同期(Renderer)
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // pong
})
ipcRenderer.send('asynchronous-message', 'ping1')
