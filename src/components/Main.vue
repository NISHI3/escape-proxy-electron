<template>
    <div>
        <div class="title">
            <div class="icon"></div>
            <div class="text">CERES PROXY</div>
        </div>
        <div class="config-show-non-active" :class="{ 'config-show': isConfigShow}">
            <div class="cog" @click="configToggle"></div>
            <div class="connect-button" :class="{loading: loading}" @click="connectToggle">{{ centerText }}
            </div>
            <div class="sep"></div>
            <div class="content "
                 :class="{'content-active': proxyProcessRunning }">
                <div v-if="proxyProcessRunning || appError.length > 0" class="active">
                    <div v-if="appError.length > 0">{{ appError }}</div>
                    <InfoRows v-else :info="this.info"></InfoRows>
                </div>
                <div v-else class="non-active">接続をクリックして<br>接続を開始してください。</div>
            </div>
        </div>
        <transition>
            <config v-if="isConfigShow"></config>
        </transition>
    </div>
</template>

<script lang="js">
    import {ipcRenderer} from "electron";
    import ClientConfig from "../scripts/model/ClientConfig";
    import ClientConfigGen from "../scripts/ClientConfigGen";
    import Config from "./Config";
    import InfoRows from "./InfoRows";

    export default {
        name: "Main",
        components: {InfoRows, Config},
        data() {
            return {
                running: false,
                loadingCount: 0,
                logText: "",
                appError: "",
                isConfigShow: false,
                info: {
                    status: "...",
                    connectHost: "",
                    connectPort: "",
                    proxy: "",
                },
                config: {
                    proxy: "",
                    gateway: "",
                    listen: "",
                }
            };
        },
        computed: {
            proxyProcessRunning() {
                return this.running;
            },
            centerText() {
                if (this.loading) {
                    return "・・・";
                }

                if (this.appError.length > 0) {
                    return "再接続";
                }

                if (this.proxyProcessRunning) {
                    return "切断";
                } else {
                    return "接続";
                }
            },
            loading: {
                get() {
                    return this.loadingCount > 0;
                },
                set(count) {
                }
            },
            logArray() {
                return this.logText.split("\n");
            },
        },
        methods: {
            incrementLoadingCount() {
                this.loadingCount++;
            },
            decrementLoadingCount() {
                if (this.loadingCount <= 0) {
                    return;
                }
                this.loadingCount--;
            },
            connectToggle() {
                if (this.loading) {
                    return;
                }
                this.appError = "";
                this.incrementLoadingCount();
                if (this.proxyProcessRunning) {
                    ipcRenderer.send("disconnect-event", undefined);
                } else {
                    let config = new ClientConfigGen(this.config.proxy, this.config.gateway, this.config.port);
                    ipcRenderer.send("connect-event", {
                        "config": config.convertYaml(),
                    });
                }
            },
            setStatus(status) {
                if (status === "unknown") {
                    this.$set(this.info, "status", `・・・`);
                } else {
                    this.$set(this.info, "status", `${status} MODE`);
                }
            },
            configToggle() {
                console.log(this.isConfigShow);
                this.isConfigShow = !this.isConfigShow;
            }
        },
        created() {
            ipcRenderer.on("connect-error", (event, arg) => {
                console.log(arg);
                if (arg.message === "null") {
                    this.running = false;
                    this.appError = "";
                    this.decrementLoadingCount();
                    return;
                }
                this.appError = arg.message;
                this.decrementLoadingCount();
                this.running = false;
            });
            ipcRenderer.on("connect-success", (event, arg) => {
                this.appError = "";

                this.$set(this.info, "status", "・・・");

                const data = arg.data;
                if (data) {
                    if (data.listen) {
                        const listen = data.listen.split(":");
                        if (listen.length === 2) {
                            this.$set(this.info, "connectHost", listen[0]);
                            this.$set(this.info, "connectPort", listen[1]);
                        }
                    }

                    if (data.proxy) {
                        this.$set(this.info, "proxy", data.proxy);
                    }
                }
                this.running = true;
                this.decrementLoadingCount();
            });
            ipcRenderer.on("connect-info", (event, arg) => {
                const data = arg.data;
                if (data.title) {
                    if (data.title === "CONNECT MODE") {
                        this.setStatus(data.value);
                    } else if (data.title === "ROUTE CHANGE") {
                        this.setStatus(data.value.mode);
                    }
                }
            });
            ipcRenderer.on("connect-exit", (event, arg) => {
                this.running = false;
                this.appError = "";
            });
        }
    };
</script>

<style lang="scss" scoped>
    .v-enter-active, .v-leave-active {
        transition: opacity ease .2s;
    }

    .v-enter, .v-leave-to {
        opacity: 0
    }

    .title {
        $size: 50px;
        display: flex;
        height: $size;
        line-height: $size;
        background-color: rgba(black, .3);

        .text {
            font-size: 20px;
            color: rgba($red-white, .7);
            text-align: center;
            letter-spacing: 4px;
            margin-right: auto;
        }

        .icon {
            position: relative;
            width: $size;
            height: $size;
            left: -($size / 2);
            background-image: $logo-x50-image;
            background-position: center;
            background-size: 50%;
            background-repeat: no-repeat;
            margin-left: auto;
            opacity: .7;
        }
    }

    .cog {
        $size: 25px;
        $_margin: 10px;
        width: $size;
        height: $size;
        border-radius: 50%;
        margin: ($_margin) ($_margin) (-($size + $_margin)) calc(100% - #{$size + $_margin});
        background-color: white;
        -webkit-mask-image: $cog-svg;
        transition: background-color ease .2s, transform ease .2s;

        &:hover {
            background-color: rgba(white, .6);
            transform: rotate(90deg);
        }
    }

    .config-show-non-active {
        transition: filter ease .2s, opacity ease .2s;

        &.config-show {
            filter: blur(15px);
            opacity: 0;
        }
    }

    .connect-button {
        $size: 200px;
        width: $size;
        height: $size;
        line-height: $size;
        text-align: center;
        border: 2px solid $red-white;
        border-radius: 50%;
        margin: 40px auto 40px auto;
        font-size: 30px;
        letter-spacing: 3px;
        transition: background-color ease .2s;

        &:hover {
            background-color: rgba(white, .15);
        }

        &::before {
            display: block;
            $over-size: 30px;
            $loading-size: $size + $over-size;
            width: $loading-size;
            height: $loading-size;
            content: ' ';
            opacity: 0;
            margin: -($over-size / 2) 0 (-$size - $over-size / 2) (-$over-size / 2);
            border-radius: 50%;
            border: 1px solid $red-white;
            border-left-color: transparent;
            border-right-color: transparent;
            transition: opacity ease .2s;
        }

        &.loading {
            &::before {
                opacity: 1;
                animation: spin 1s linear infinite;
            }
        }
    }

    .sep {
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, rgba($red-white, 0) 0%, rgba($red-white, 1) 15%, rgba($red-white, 1) 85%, rgba($red-white, 0) 100%);
        margin: 20px 0 0 0;
    }

    .content {
        height: $main-rows-height;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        overflow-y: auto;

        &.content-active {
            justify-content: center;
            align-items: stretch;
        }


        .non-active {
            text-align: center;
        }

        .active {
            width: 100%;
        }
    }
</style>
