import {
    app,
    App,
    BrowserWindow,
    ipcMain,
    IpcMain,
    Tray,
    Menu,
    MenuItemConstructorOptions,
    BrowserWindowConstructorOptions
} from "electron";
import * as fs from "fs";
import Client from "./scripts/Client";
import PlatformUtils from "./scripts/PlatformUtils";
import {Platform} from "./scripts/model/Platform";
import DevelopUtils from "./scripts/DevelopUtils";
import MenuItem = Electron.MenuItem;
import remote = Electron.remote;
import {exec} from "child_process";

class MainApp {
    private win: BrowserWindow | undefined = undefined;
    private tray: Tray | undefined = undefined;
    private app: App;
    private ipcMain: IpcMain;
    private indexPath: string = `file://${__dirname}/index.html`;
    private client: Client | undefined;
    private path: string = "";
    private settingFile = PlatformUtils.getTempFile();
    private exitFlag = false;

    constructor(app: App, ipcMain: IpcMain) {
        if (!PlatformUtils.isWindows() && DevelopUtils.isDev()) {
            exec(`chmod -R a+x ${__dirname}/bin`);
        }

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
        this.ipcMain.on("exit-event", this.exitEvent.bind(this));

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
        if (PlatformUtils.isWindows() || PlatformUtils.isLinux()) {
            if (DevelopUtils.isDev()) {
                windowHeight += 50;
            } else {
                windowHeight += 40;
            }
        }
        const windowOption: BrowserWindowConstructorOptions = {
            width: 400,
            height: windowHeight,
            show: PlatformUtils.isWindows(),
            frame: !PlatformUtils.isMac(),
            fullscreenable: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                backgroundThrottling: false
            }
        };
        if (PlatformUtils.isWindows() || PlatformUtils.isLinux()) {
            windowOption.icon = `${__dirname}/images/icon-red_x50.png`;
        }

        this.win = new BrowserWindow(windowOption);

        if (DevelopUtils.isDev()) {
            this.win.webContents.openDevTools({mode: "detach"});
        }
        this.win.loadURL(this.indexPath);
        this.win.on("close", (event: Event) => {
            if (PlatformUtils.isWindows() || PlatformUtils.isLinux()) {
                if (this.win === undefined || this.exitFlag) {
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
            if (!this.win.webContents.isDevToolsOpened() && PlatformUtils.isMac()) {
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

        if (PlatformUtils.isMac()) {
            Menu.setApplicationMenu(Menu.buildFromTemplate(template));
        }
    }

    private createTray() {
        this.tray = new Tray(__dirname + "/images/tray-icon.png");
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "終了",
                click: () => {
                    this.exitEvent();
                }
            }
        ]);

        this.tray.on("double-click", this.toggleWindow);
        this.tray.on("click", (event) => {
            event.preventDefault();
            this.toggleWindow();
            if (this.win === undefined) return;
        });

        if (PlatformUtils.isMac()) {
            this.tray.on("right-click", (e) => {
                if (this.tray === undefined) {
                    return;
                }
                e.preventDefault();
                this.tray.popUpContextMenu(contextMenu);
            });
        } else {
            this.tray.setContextMenu(contextMenu);
        }
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
        } else if (PlatformUtils.isLinux()) {
            this.win.center();
        } else if (PlatformUtils.isMac()) {
            this.win.setPosition(position.x, position.y, false);
        }
        this.win.show();
        this.win.focus();
        if (PlatformUtils.isMac() || PlatformUtils.isLinux()) {
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

        if (PlatformUtils.isWindows()) {
            exec("taskkill /IM escape-proxy-windows.exe /F", () => {
                this.client = new Client(event.sender, this.path, this.settingFile);
            });
        } else {
            this.client = new Client(event.sender, this.path, this.settingFile);
        }

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

    private exitEvent(){
        this.exitFlag = true;
        if (typeof this.client !== "undefined") {
            this.client.disconnect();
        }
        this.app.quit();
    }
}

const MyApp: MainApp = new MainApp(app, ipcMain);
