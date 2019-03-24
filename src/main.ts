import {app, App, BrowserWindow, ipcMain, IpcMain, Tray} from "electron";
import * as fs from "fs";
import Client from "./scripts/Client";

class MainApp {
    private win: BrowserWindow | undefined = undefined;
    private tray: Tray | undefined = undefined;
    private app: App;
    private ipcMain: IpcMain;
    private indexPath: string = `file://${__dirname}/index.html`;
    private client: Client | undefined;

    constructor(app: App, ipcMain: IpcMain) {
        this.app = app;
        this.ipcMain = ipcMain;

        this.app.dock.hide();
        this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
        this.app.on("activate", this.onActivated.bind(this));

        this.ipcMain.on("connect-event", this.connect.bind(this));
        this.ipcMain.on("disconnect-event", this.disconnect.bind(this));

        this.app.on("ready", () => {
            this.createTray();
            this.createWindow();
        });
    }

    private onWindowAllClosed() {
        if (process.platform !== "darwin") {
            this.app.quit();
        }
    }

    private createWindow() {
        this.win = new BrowserWindow({
            width: 400,
            height: 650,
            show: false,
            frame: false,
            fullscreenable: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                backgroundThrottling: false
            }
        });
        this.win.webContents.openDevTools({mode: "detach"});
        this.win.loadURL(this.indexPath);
        this.win.on("closed", () => {
            this.win = undefined;
        });
        this.win.on("blur", () => {
            if (this.win === undefined) {
                return;
            }
            if (!this.win.webContents.isDevToolsOpened()) {
                this.win.hide();
            }
        });
    }

    private createTray() {
        this.tray = new Tray(__dirname + "/images/tray-icon.png");
        this.tray.on("right-click", this.toggleWindow);
        this.tray.on("double-click", this.toggleWindow);
        this.tray.on("click", (event) => {
            this.toggleWindow();
            if (this.win === undefined) return;

            if (this.win.isVisible() && process.defaultApp && event.metaKey) {
                this.win.webContents.openDevTools({mode: "detach"});
            }
        });
    }

    private toggleWindow() {
        if (this.win === undefined) return;

        if (this.win.isVisible()) {
            this.win.hide();
        } else {
            this.showWindow();
        }
    }

    private showWindow() {
        const position = this.getWindowPosition();

        if (this.win === undefined || position === undefined) {
            return;
        }

        this.win.setPosition(position.x, position.y, false);
        this.win.show();
        this.win.focus();
        this.win.setAlwaysOnTop(true);
    }

    private getWindowPosition() {
        if (this.win === undefined || this.tray === undefined) {
            return;
        }

        const windowBounds = this.win.getBounds();
        const trayBounds = this.tray.getBounds();

        // Center window horizontally below the tray icon
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

        // Position window 4 pixels vertically below the tray icon
        const y = Math.round(trayBounds.y + trayBounds.height + 4);

        return {x: x, y: y};
    }

    private onActivated() {
        if (this.win === null) {
            this.createWindow();
        }
    }

    private connect(event: any, arg: any) {
        console.log(arg);
        fs.writeFile("/tmp/ex.yaml", arg.config, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
        });
        this.client = new Client(event.sender);
    }

    private disconnect(event: any, arg: any) {
        if (this.client === undefined) {
            return;
        }
        this.client.disconnect();
    }
}

const MyApp: MainApp = new MainApp(app, ipcMain);
