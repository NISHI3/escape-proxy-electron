export default class ClientConfig {
    public auth: boolean | undefined;
    public auto_direct_connect: boolean | undefined;
    public proxy: string | undefined;
    public gateway: string | undefined;
    public log_mode: string | undefined;
    public listen: string | undefined;
    public exclude: Array<string> | undefined;
}
