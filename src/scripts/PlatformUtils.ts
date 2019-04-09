import {Platform} from "./model/Platform";

const uuid = require("uuid/v4");

export default class PlatformUtils {
    static isWindows(): boolean {
        return PlatformUtils.getPlatform() === Platform.Windows;
    }

    static isMac(): boolean {
        return PlatformUtils.getPlatform() === Platform.Mac;
    }

    static isLinux(): boolean {
        return PlatformUtils.getPlatform() === Platform.Linux;
    }

    static getPlatform(): Platform {
        switch (process.platform) {
            case "win32":
                return Platform.Windows;
            case "darwin":
                return Platform.Mac;
            case "linux":
                return Platform.Linux;
            default:
                return Platform.Other;
        }
    }

    static getTempFile() {
        const fileName = uuid();
        switch (PlatformUtils.getPlatform()) {
            case Platform.Windows:
                return process.env.TEMP + "/" + fileName;
            default:
                return "/tmp/" + fileName;
        }
    }
}
