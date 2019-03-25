<template>
    <div>
        <div class="row status">
            {{ info.status }}
        </div>
        <div class="row">
            <div class="row-title">接続モード</div>
            <div class="row-content selectable">{{ info.status }}</div>
        </div>
        <div class="row">
            <div class="row-title">状態</div>
            <div class="row-content selectable">接続可能</div>
        </div>
        <div class="row">
            <div class="row-title">接続先ホスト</div>
            <div class="row-content selectable">{{ info.connectHost }}</div>
        </div>
        <div class="row">
            <div class="row-title">SOCKS 接続先ポート</div>
            <div class="row-content selectable">{{ info.connectPort }}</div>
        </div>
        <!--<div class="row">-->
            <!--<div class="row-title">HTTP 接続先ポート</div>-->
            <!--<div class="row-content selectable">{{ info.connectPort }}</div>-->
        <!--</div>-->
        <div class="row">
            <div class="row-title">プロキシ</div>
            <div class="row-content" style="font-size: 12px;">{{ info.proxy }}</div>
        </div>
        <div class="row max-size"></div>
    </div>
</template>

<script lang="js">
    export default {
        name: "InfoRows",
        props: ["info"]
    };
</script>

<style lang="scss" scoped>
    .row {
        display: flex;
        height: 35px;
        line-height: 35px;

        &.status {
            margin: 0 0 15px 0;
            background: rgba(black, .3);
            height: 80px;
            line-height: 80px;
            font-size: 18px;
            display: block;
            text-align: center;
            letter-spacing: 2px;
            font-weight: 900;
        }

        &.max-size {
            $row-number: 7;
            height: $main-rows-height - (35px * $row-number) - 25px;
        }

        .row-title {
            width: calc(45% - 10px);
            text-align: right;
        }

        .row-content {
            margin-left: 20px;
            width: calc(55% - 10px);
        }
    }
</style>
