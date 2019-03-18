// const {app, BrowserWindow, Tray } = require('electron');
import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from 'child_process';

let win
function createWindow() {
    // let tray = new Tray(__dirname + '/images/icon2.png');
    // ToDo: BrowserWindowのプロパティで{x: 0, y: 0}があったので、ボタンの位置を取得して位置をいじる
    win = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600
    })
    // app.dock.hide();
    win.loadURL('file://' + __dirname + '/index.html')
    // 開発時のみ
    process.env.NODE_ENV === 'production' ? '' : win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
    // tray.on('click', () => {
    //     win.isVisible() ? win.hide() : win.show()
    // })
    // win.on('show', () => {
    //     tray.setHighlightMode('always')
    // })
    // win.on('hide', () => {
    //     tray.setHighlightMode('never')
    // })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


  // 非同期(Main)
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg)  // ping
    exec('ls -la ./', (err, stdout, stderr) => {
        if (err) { console.log(err); }
        event.sender.send('asynchronous-reply', stdout)
      });
    // event.sender.send('asynchronous-reply', 'pong2')
  })