<template>
    <div>
        <div class="title">
            <div class="icon"></div>
            <div class="text">CERES PROXY</div>
        </div>
        <div class="connect-button">接続</div>
        <div class="sep"></div>
        <div class="content">
            <div v-if="proxyProcessRunning">起動</div>
            <div v-else class="non-active">接続をクリックして<br>接続を開始してください。</div>
        </div>
    </div>
</template>

<script lang="js">
    export default {
        name: "Main",
        computed: {
            proxyProcessRunning() {
                return false;
            }
        }
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
        width: 250px;
        height: 250px;
        line-height: 250px;
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
    }

    .sep {
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, rgba($red-white, 0) 0%, rgba($red-white, 1) 15%, rgba($red-white, 1) 85%, rgba($red-white, 0) 100%);
        margin: 20px 0 0 0;
    }

    .content {
        height: 115px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .non-active {
            text-align: center;
        }
    }
</style>
