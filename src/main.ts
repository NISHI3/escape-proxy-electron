import {app, App, BrowserWindow, ipcMain, IpcMain, Tray, Menu, MenuItemConstructorOptions} from "electron";
import * as fs from "fs";
import Client from "./scripts/Client";
import PlatformUtils from "./scripts/PlatformUtils";
import {Platform} from "./scripts/model/Platform";
import DevelopUtils from "./scripts/DevelopUtils";

class MainApp {
    private win: BrowserWindow | undefined = undefined;
    private tray: Tray | undefined = undefined;
    private app: App;
    private ipcMain: IpcMain;
    private indexPath: string = `file://${__dirname}/index.html`;
    private client: Client | undefined;
    private path: string = "";
    private settingFile = PlatformUtils.getTempFile();

    constructor(app: App, ipcMain: IpcMain) {
        this.app = app;
        this.ipcMain = ipcMain;

        this.path = app.getAppPath();

        if (PlatformUtils.isMac()) {
            this.app.dock.hide();
        }
        this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
        this.app.on("activate", this.onActivated.bind(this));

        this.ipcMain.on("connect-event", this.connect.bind(this));
        this.ipcMain.on("disconnect-event", this.disconnect.bind(this));
        this.ipcMain.on("test-event", this.testEvent.bind(this));

        this.app.on("ready", () => {
            this.setupMenus();
            this.createTray();
            this.createWindow();
        });
    }

    private onWindowAllClosed() {
        if (PlatformUtils.getPlatform() !== Platform.Mac) {
            this.app.quit();
        }
    }

    private createWindow() {
        let windowHeight = 650;
        if (PlatformUtils.getPlatform() === Platform.Windows) {
            if (DevelopUtils.isDev()) {
                windowHeight += 50;
            } else {
                windowHeight += 40;
            }
        }
        this.win = new BrowserWindow({
            width: 400,
            height: windowHeight,
            show: PlatformUtils.isWindows(),
            frame: PlatformUtils.isWindows(),
            fullscreenable: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                backgroundThrottling: false
            }
        });

        if (DevelopUtils.isDev()) {
            this.win.webContents.openDevTools({mode: "detach"});
        }
        this.win.loadURL(this.indexPath);
        this.win.on("close", (event: Event) => {
            if (PlatformUtils.isWindows()) {
                if (this.win === undefined) {
                    return;
                }
                this.win.hide();

                event.preventDefault();
            }
        });
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

    private setupMenus() {
        var template: Array<MenuItemConstructorOptions> = [
            {
                label: "Edit",
                submenu: [
                    {role: "undo"},
                    {role: "redo"},
                    {type: "separator"},
                    {role: "cut"},
                    {role: "copy"},
                    {role: "paste"},
                    {role: "pasteandmatchstyle"},
                    {role: "delete"},
                    {role: "selectall"}
                ]
            }
        ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    }

    private createTray() {
        this.tray = new Tray(__dirname + "/images/tray-icon.png");
        this.tray.on("right-click", this.toggleWindow);
        this.tray.on("double-click", this.toggleWindow);
        this.tray.on("click", (event) => {
            this.toggleWindow();
            if (this.win === undefined) return;
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

        if (PlatformUtils.isWindows()) {
            this.win.center();
        } else {
            this.win.setPosition(position.x, position.y, false);
        }
        this.win.show();
        this.win.focus();
        if (PlatformUtils.isMac()) {
            this.win.setAlwaysOnTop(true);
        }
    }

    private getWindowPosition() {
        if (this.win === undefined || this.tray === undefined) {
            return;
        }

        if (PlatformUtils.isWindows()) {
            return {x: 0, y: 0};
        } else {
            const windowBounds = this.win.getBounds();
            const trayBounds = this.tray.getBounds();

            // Center window horizontally below the tray icon
            const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

            // Position window 4 pixels vertically below the tray icon
            const y = Math.round(trayBounds.y + trayBounds.height + 4);

            return {x: x, y: y};
        }
    }

    private onActivated() {
        if (this.win === null) {
            this.createWindow();
        }
    }

    private connect(event: any, arg: any) {
        fs.writeFile(this.settingFile, arg.config, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
        });
        this.client = new Client(event.sender, this.path, this.settingFile);
    }

    private disconnect(event: any, arg: any) {
        if (this.client === undefined) {
            return;
        }
        this.client.disconnect();
    }

    private testEvent(event: any, arg: any) {
        if (this.client === undefined) {
            return;
        }
        this.client.testGet();
    }
}

const MyApp: MainApp = new MainApp(app, ipcMain);
