export default class DevelopUtils {
    static isDev(): boolean {
        return process.env.NODE_ENV === "development";
    }
}
