<template>
    <div>
        <div class="title">
            <div class="icon"></div>
            <div class="text">CERES PROXY</div>
        </div>
        <div class="connect-button" :class="{loading: loading}" @click="connectToggle">{{ centerText }}</div>
        <div class="sep"></div>
        <div class="content">
            <div v-if="proxyProcessRunning" class="active">
                <div class="row">
                    <div class="row-title">状態</div>
                    <div class="row-content">{{ status }}</div>
                </div>
                <div class="row">
                    <div class="row-title">接続先ホスト</div>
                    <div class="row-content selectable">{{ connectHost }}</div>
                </div>
                <div class="row">
                    <div class="row-title">接続先ポート</div>
                    <div class="row-content selectable">{{ connectPort }}</div>
                </div>
                <div class="row">
                    <div class="row-title">プロキシ</div>
                    <div class="row-content" style="font-size: 12px;">{{ proxy }}</div>
                </div>
            </div>
            <div v-else class="non-active">接続をクリックして<br>接続を開始してください。</div>
        </div>
    </div>
</template>

<script lang="js">
    export default {
        name: "Main",
        data() {
            return {
                flag: false,
                loadingCount: 0,
                logText: "aaa\nbbb\nccc\nddd\eee"
            };
        },
        computed: {
            proxyProcessRunning() {
                return this.flag;
            },
            centerText() {
                if (this.loading) {
                    return "・・・";
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
            status() {
                return "...";
            },
            connectHost() {
                return "localhost";
            },
            connectPort() {
                return "40371";
            },
            proxy() {
                return "xxxxxxxxxxxx";
            }
        },
        methods: {
            incrementLoadingCount() {
                this.loadingCount++;
            },
            decrementLoadingCount() {
                this.loadingCount--;
            },
            connectToggle() {
                if (this.loading) {
                    return;
                }
                this.incrementLoadingCount();
                setTimeout(() => {
                    this.flag = !this.flag;
                    this.decrementLoadingCount();
                }, 2000);
            }
        },
    };
</script>

<style lang="scss" scoped>
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
        $height: 165px;
        height: $height;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;

        .non-active {
            text-align: center;
        }

        .active {
            width: 90%;

            .row {
                display: flex;
                height: 30px;
                line-height: 30px;

                .row-title {
                    width: 33%;
                }

                .row-content {
                    width: 67%;
                }
            }
        }
    }
</style>
