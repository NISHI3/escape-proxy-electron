<template>
    <div class="config">
        <h2 class="title">設定</h2>
        <div class="config-container">
            <div class="rows">
                <div class="row">
                    <label>接続先PROXY</label>
                    <input id="proxy" type="text" placeholder="Host:Port" v-model="inputData.proxy">
                </div>
                <div class="row">
                    <label>接続先GATEWAY</label>
                    <input id="gateway" type="text" placeholder="Host:Port" v-model="inputData.gateway">
                </div>
                <div class="row">
                    <label>LISTENポート</label>
                    <input id="port" type="text" placeholder="Port" v-model="inputData.port">
                </div>
                <div class="row one-line">
                    <label class="row-title">起動時に自動接続</label>
                    <input id="auto-connect" type="checkbox" v-model="inputData.isAutoConnect">
                    <label for="auto-connect" class="row-content"></label>
                </div>
            </div>
            <div class="advance-option-show" @click="showAdvanceOptions = !showAdvanceOptions">高度な設定の表示<span
                class="advance-options-triangle" :class="{ 'shown': showAdvanceOptions }">▼</span></div>
            <div class="advance-options rows" v-show="showAdvanceOptions">
                <div class="row">
                    <label>Listen host</label>
                    <input id="host" type="text" placeholder="Host" v-model="inputData.host">
                </div>
                <div class="row one-line">
                    <label for="auto-direct-mode" class="row-title">Auto direct mode</label>
                    <input id="auto-direct-mode" type="checkbox" v-model="inputData.isAutoDirectConnect">
                    <label for="auto-direct-mode" class="row-content"></label>
                </div>
                <div class="row">
                    <label>Direct connect host</label>
                    <input id="direct-host" type="text" placeholder="direct connect hosts(sep=',')"
                           v-model="inputData.exclude">
                </div>
            </div>
        </div>

        <div class="bottom-fix">
            <div class="actions">
                <div class="button" @click="close">キャンセル</div>
                <div class="button" @click="apply">適用</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Config",
        props: ["value"],
        data() {
            return {
                inputData: {},
                showAdvanceOptions: false,
            };
        },
        methods: {
            apply() {
                this.$emit("input", this.inputData);
                this.close();
            },
            close() {
                this.$emit("close");
            }
        },
        created() {
            this.inputData = Object.assign({}, this.value);
        }
    };
</script>


<style lang="scss" scoped>
    .config {
        position: fixed;
        left: 0;
        top: 50px;
        width: 100%;
        height: calc(100% - 50px);

        .title {
            text-align: center;
        }

        .config-container {
            overflow-y: auto;
            height: calc(100% - 82px - 76px);
        }

        .rows {
            width: 95%;
            margin: 15px auto 0 auto;

            .row {
                height: 63px;
                line-height: 63px;
                margin: 20px 15px;

                &.one-line {
                    display: flex;
                    height: 40px;
                    line-height: 40px;
                }

                label {
                    display: block;
                    font-size: 13px;
                    height: 20px;
                    line-height: 20px;
                    margin-bottom: 3px;
                }

                &.one-line label.row-title {
                    width: 35%;
                    height: 40px;
                    line-height: 40px;
                    margin: 0;
                }

                input {
                    width: 98%;
                    margin-left: 2%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    border: 1px solid rgba(white, .8);
                    background-color: transparent;
                    transition: background-color ease .2s;
                    color: white;
                    box-sizing: border-box;
                    padding: 0 8px;
                    outline: none;
                    -webkit-user-select: text;
                    border-radius: 2px;

                    &:focus {
                        background-color: rgba(white, .15);
                    }

                    &::placeholder {
                        color: rgba(white, .7);
                    }
                }

                &.one-line .row-content {
                    width: 35%;
                    height: 40px;
                    line-height: 40px;
                    margin: 0;
                }

                #auto-connect, #auto-direct-mode {
                    $height: 25px;
                    $width: 60px;
                    display: none;

                    & + label {
                        width: $width;
                        height: $height;
                        box-sizing: border-box;
                        margin: #{(40px - $height) / 2} 0;
                        border-radius: 15px;
                        border: 1px solid rgba(white, .7);
                        background-color: white;
                        transition: background-color ease .3s;

                        &::after {
                            background-color: $main-color;
                            width: $height - 2px;
                            height: $height - 2px;
                            border-radius: 50%;
                            content: ' ';
                            display: block;
                            box-sizing: border-box;
                            transition: transform ease .3s;
                        }
                    }

                    &:checked + label {
                        background-color: rgb(251, 192, 45);

                        &::after {
                            transform: translateX(#{$width - $height});
                        }
                    }
                }
            }
        }

        .advance-option-show {
            text-align: center;
            font-size: 12px;
            opacity: .8;
            cursor: pointer;

            span {
                display: inline-block;
                margin-left: 5px;
                transition: transform ease .3s;

                &.shown {
                    transform: rotateZ(180deg);
                }
            }
        }

        .bottom-fix {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 20px 25px;

            .actions {
                display: flex;
                justify-content: flex-end;

                .button {
                    width: 35%;
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid white;
                    text-align: center;
                    border-radius: 2px;
                    transition: background-color ease .2s;

                    &:not(:last-child) {
                        margin-right: 25px;
                    }

                    &:hover {
                        background-color: rgba(white, .15);
                    }
                }
            }
        }
    }
</style>
