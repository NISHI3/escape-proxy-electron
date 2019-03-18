import { app, App, BrowserWindow, ipcMain, IpcMain } from 'electron'
import { exec } from 'child_process'

class MainApp {
    private win: BrowserWindow | null = null;
    private app: App;
    private ipcMain: IpcMain
    private indexPath: string = `file://${__dirname}/index.html`

    constructor(app: App, ipcMain: IpcMain) {
        this.app = app;
        this.ipcMain = ipcMain
        this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))
        this.app.on('ready', this.createWindow.bind(this));
        this.app.on('activate', this.onActivated.bind(this));
        this.ipcMain.on('asynchronous-message', this.asyncMessage.bind(this));
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            this.app.quit();
        }
    }

    private createWindow() {
        this.win = new BrowserWindow({
            frame: false,
            width: 800,
            height: 600
        });
        this.win.webContents.openDevTools()
        this.win.loadURL(this.indexPath);
        this.win.on('closed', () => {
            this.win = null;
        });
    }

    private onActivated() {
        if (this.win === null) {
            this.createWindow();
        }
    }

    private asyncMessage(event: any, arg: any) {
        console.log(arg);
        exec('ls -la ./', (err, stdout, stderr) => {
            if (err) { console.log(err); }
            event.sender.send('asynchronous-reply', stdout)
          });
    }
}

const MyApp: MainApp = new MainApp(app, ipcMain)