<template>
    <div class="config">
        <h2 class="title">設定</h2>
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

        .rows {
            width: 95%;
            margin: 15px auto 0 auto;

            .row {
                height: 63px;
                line-height: 63px;
                margin: 20px 15px;

                label {
                    display: block;
                    font-size: 13px;
                    height: 20px;
                    line-height: 20px;
                    margin-bottom: 3px;
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
