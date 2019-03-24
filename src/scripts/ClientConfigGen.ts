import ClientConfig from "./model/ClientConfig";

const yaml = require("js-yaml");

export default class ClientConfigGen {
    private config: ClientConfig;

    constructor(proxy: string, gateway: string, port: string) {
        this.config = new ClientConfig();
        this.config.auth = false;
        this.config.auto_direct_connect = true;
        this.config.proxy = proxy;
        this.config.gateway = gateway;
        this.config.log_mode = "json";
        this.config.listen = `localhost:${port}`;
        this.config.exclude = [
            "192.168.0.0/16",
            "10.0.0.0/8",
            "172.16.0.0/11"
        ];
    }

    public convertYaml(): string {
        return yaml.safeDump(this.config);
    }
}
