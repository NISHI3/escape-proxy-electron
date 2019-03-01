const {app, BrowserWindow, Tray } = require('electron');

// function createWindow() {
//     mainWindow = new BrowserWindow({width: 800, height: 600});
//     mainWindow.loadFile('index.html');
//     mainWindow.on('closed', () => {
//          mainWindow = null;
//     });
// }

app.on('ready',  () => {
    let tray = new Tray(__dirname + '/images/icon2.png');
    let win = new BrowserWindow({frame: false, width: 800, height: 600});
    app.dock.hide();
    win.loadFile('index.html');
    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
    })
    win.on('show', () => {
        tray.setHighlightMode('always')
    })
    win.on('hide', () => {
        tray.setHighlightMode('never')
    })
});


// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });
// app.on('activate', () => {
//     if (mainWindow === null) {
//         createWindow();
//     }
// });