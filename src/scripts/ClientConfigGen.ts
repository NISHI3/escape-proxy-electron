import ClientConfig from "./model/ClientConfig";

const yaml = require("js-yaml");

export default class ClientConfigGen {
    public config: ClientConfig;

    constructor(proxy: string, gateway: string, port: string) {
        this.config = ClientConfigGen.getDefaultSettings();
        this.setDefault(proxy, gateway, port);
    }

    public setDefault(proxy: string, gateway: string, port: string) {
        this.config = ClientConfigGen.getDefaultSettings();
        this.config.proxy = proxy;
        this.config.gateway = gateway;
        this.config.listen = `localhost:${port}`;
    }

    static getDefaultSettings(): ClientConfig {
        let c = new ClientConfig();
        c.auth = false;
        c.auto_direct_connect = true;
        c.proxy = "";
        c.gateway = "";
        c.log_mode = "json";
        c.listen = "localhost:41204";
        c.exclude = [
            "192.168.0.0/16",
            "10.0.0.0/8",
            "172.16.0.0/11"
        ];
        return c;
    }

    static mergeSettingsDefault(settings?: any): object {
        const defaultSetting = ClientConfigGen.getDefaultSettings();

        if (typeof settings === "undefined") {
            settings = {};
        }

        if (typeof settings["auth"] !== "boolean") {
            settings["auth"] = defaultSetting.auth;
        }

        if (typeof settings["isAutoDirectConnect"] !== "boolean") {
            settings["isAutoDirectConnect"] = defaultSetting.auto_direct_connect;
        }

        if (typeof settings["proxy"] !== "string") {
            settings["proxy"] = defaultSetting.proxy;
        }

        if (typeof settings["gateway"] !== "string") {
            settings["gateway"] = defaultSetting.gateway;
        }

        settings["log_mode"] = "json";

        if (typeof defaultSetting.listen === "undefined") {
            // 本来ありえない
            return defaultSetting;
        }
        let listenSep = defaultSetting.listen.split(":");
        let host = "";
        let port = "";
        for (let i = 0; i < listenSep.length - 1; i++) {
            if (host.length > 0) {
                host += ":";
            }
            host += listenSep[i];
        }
        port = listenSep[listenSep.length - 1];
        if (typeof settings["port"] !== "string" && typeof settings["port"] !== "number") {
            settings["port"] = port;
        }

        if (typeof settings["host"] !== "string") {
            settings["host"] = host;
        }

        if (typeof settings["exclude"] !== "string") {
            settings["exclude"] = "";
            if (typeof defaultSetting.exclude !== "undefined") {
                defaultSetting.exclude.forEach(v => {
                    if (settings["exclude"].length > 0) {
                        settings["exclude"] += ",";
                    }
                    settings["exclude"] += v;
                });
            }
        }

        // yamlに影響しない設定
        if (typeof settings["isAutoConnect"] !== "boolean") {
            settings["isAutoConnect"] = false;
        }

        return settings;
    }

    public convertYaml(): string {
        return yaml.safeDump(this.config);
    }
}
