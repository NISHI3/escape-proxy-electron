import {ChildProcess, exec, spawn} from "child_process";
import PlatformUtils from "./PlatformUtils";
import * as child_process from "child_process";

const request = require("request");
const Agent = require("socks5-http-client/lib/Agent");
const iconv = require("iconv-lite");

export default class Client {
    private sender: any;
    private buffer: Array<any> = [];
    private proc: ChildProcess | undefined;
    private listenProxy: string = "";

    constructor(sender: any, path: string, settingFile: string) {
        this.sender = sender;

        if (PlatformUtils.isMac()) {
            this.proc = spawn(`${path}/bin/escape-proxy-mac`, ["client", "-c", settingFile], {shell: true});
        } else if (PlatformUtils.isWindows()) {
            this.proc = spawn(`${path}/bin/escape-proxy-windows.exe`, ["client", "-c", settingFile], {shell: true});
        } else {
            return;
        }
        this.proc.stdout.on("data", (data) => {
            const text = this.getLine(data).trim();
            if (text.length === 0) {
                return;
            }
            const json = JSON.parse(text);
            console.log(json);

            if (json.title) {
                if (json.title === "START UP") {
                    this.listenProxy = json.value.listen;
                    this.testGet();
                    this.successEvent(json, text);
                } else {
                    sender.send("connect-info", {
                        data: json,
                        message: text,
                    });
                }
            } else {
                sender.send("connect-error", {
                    message: "json parse error",
                });
            }
        });

        this.proc.stderr.on("data", (data) => {
            console.log(data, data.toString(), iconv.decode(data, "Shift_JIS").toString());
            let text = data.toString();
            if (PlatformUtils.isWindows()) {
                text = iconv.decode(data, "Shift_JIS").toString();
            }
            sender.send("connect-error", {
                message: text,
            });
        });

        this.proc.on("close", (code) => {
            console.log("ERROR", code);
            // sender.send("connect-error", {
            //     message: String(code),
            // });
        });
    }

    private getLine(buffer: any): string {
        for (let i = 0; i < buffer.length; i++) {
            const c = String.fromCharCode(buffer[i]);
            if (c == "\n") {
                const returnStringBuffer = Buffer.alloc(this.buffer.length);
                returnStringBuffer.set(this.buffer, 0);
                this.buffer = [];

                if (PlatformUtils.isWindows()) {
                    return iconv.decode(returnStringBuffer, "Shift_JIS").toString();
                } else {
                    return returnStringBuffer.toString();
                }
            }
            this.buffer.push(buffer[i]);
        }
        return "";
    }

    private sendError() {

    }

    private successEvent(json: any, data: any) {
        this.sender.send("connect-success", {
            data: json.value,
            message: data.toString(),
        });
    }

    public disconnect() {
        if (this.proc === undefined) {
            return;
        }
        if (PlatformUtils.isWindows()) {
            child_process.exec(`taskkill /pid ${this.proc.pid} /T /F`, () => {
                console.log("QUIT");
                this.sender.send("connect-exit", undefined);
            });
        } else {
            this.proc.kill("SIGTERM");
            this.sender.send("connect-exit", undefined);
        }
    }

    public testGet() {
        const proxyArgs = this.listenProxy.split(":");
        const proxyHost = proxyArgs[0];
        let proxyPort = 41204;
        if (proxyArgs.length === 2) {
            proxyPort = Number(proxyArgs[1]);
        }

        request({
            url: `http://example.com?t=${new Date().getTime()}`,
            agentClass: Agent,
            agentOptions: {
                socksHost: proxyHost,
                socksPort: proxyPort
            }
        }, (err: any, res: any) => {
            console.log(err);
        });
    }
}
