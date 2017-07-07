<template>
    <div id="yao" class="wrap-page">
        <audio preload="auto" id="audio-a" src="../../static/images/audio-a.mp3" class="preload"></audio>
        <audio preload="auto" id="audio-b" src="../../static/images/audio-b.mp3" class="preload"></audio>
        <section class="home-box">
            <section class="main-top m-t-b">
                <header>
                    <section id="marquee" class="marquee"><ul></ul></section>
                    <p class="thanks-tips"></p>
                </header>
                <img class="bg-yao yao-top" src="../../static/images/bg-wheel-top.png">
            </section>
            <section class="main-foot m-f-b">
                <img class="bg-yao yao-bottom" src="../../static/images/bg-wheel-bottom.png">
                <section class="footer">
                    <a class="link-out none" id="link-out" data-collect="true" data-collect-flag="lottery-link-btn" data-collect-desc="摇奖页-吸粉链接"><p></p></a>
                </section>
                <copyright class="copyright"></copyright>
            </section>
        </section>
        <!--  <input type="button" class="" id="test" value="红包按钮" style="position:absolute;top:50%;z-index:9999999999;"> -->

        <section id="article">
            <section class="comments" id="comments"></section>
        </section>
    </div>
</template>

<script>
    import copyright from './common/copyright.vue'

    export default {
      name: 'yao',
      components: {
        'copyright': copyright
      },
      data: function () {
        return {

        }
      }
    }
</script>
<style scoped>
    html{
        background: #FFF;
    }
    body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 0;
        background: url(../../static/images/bg-yao-default.jpg) no-repeat center center #FFF;
        background-size: 100% auto;
    }
    .home-box {
        position:absolute;
        top:0;
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .home-box .bg-yao {
        display: block;
        position: absolute;
        width: 62%;
        left: 19%;
        opacity: 1;
        z-index: 2;
    }
    .home-box .yao-top {
        bottom: 0;
    }
    .home-box .yao-bottom {
        top: 0;
    }
    .main-top {
        position:absolute;
        top:0px;
        width:100%;
        height:50%;
        background: url(../../static/images/bg-lottery-top.jpg) no-repeat bottom center;
        background-size: 100% 100%;;
        text-align: center;
        box-sizing:border-box;
        -webkit-transition: -webkit-transform .2s ease;
    }
    .main-top .header {
        position: relative;
        width: 100%;
        clear: both;
        overflow: hidden;
        z-index: 99999;
    }
    .main-top .header .icon-yhlogo {
        width: 32%;
        float: left;
        margin: 10px 0 0 8px;
    }
    .icon-lotterytip {
        width: 33%;
        clear: both;
        margin: 3% auto 2%;
        background-blend-mode: hard-light;
    }
    .marquee {
        display: block;
        width: 96%;
        margin: 2.5% auto 1px;
        color: #FFF;
        font-size: 16px;
        height: 35px;
        text-align: center;
        overflow: hidden;
        opacity: 0;
        background: #510f7a;
        border-radius: 5px;
    }
    .marquee:before{
        content: '';
        display: inline-block;
        width: 30px;
        height: 27px;
        /*background: url(../../static/images/lb.png) no-repeat;*/
        background-size: 30px 27px;
        float: left;
        margin: 4px 6px 6px 6px;
    }
    .marquee span {
        display: inline-block;
        color: #FFF;
        text-overflow: ellipsis;
        display: -webkit-inline-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #FFF;
        font-size: 14px;
        vertical-align: text-bottom;
    }
    .marquee li {
        display: block;
        height: 30px;
        line-height: 33px;
        overflow: hidden;
        margin:0 10px;
        position: relative;
    }
    .marquee li i{
        background: #FFF;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin-right: 3px;
        /*vertical-align: text-top;*/
        position: relative;
        top: -10px;
    }

    .countdown{
        position: relative;
        margin: 2% auto 0;
        color: #23c2e0;
        font-size: 36px;
        width: 100%;
        text-align: center;
        text-shadow: 0px 1px 0px #fff;
        z-index: 9;
    }
    .countdown .countdown-tip img{
        width: 37%;
        margin-bottom: 19px;
    }
    .countdown .detail-countdown{
        display: block;
        width: 404px;
        height: 85px;
        background: url(../../static/images/count-bbg.png) no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
    }
    .countdown .detail-countdown label i{
        display: inline-block;
        width: 42px;
        height: 64px;
        line-height: 64px;
        background: url(../../static/images/icon-num-bg.png) no-repeat;
        background-size: 100% 100%;
        margin: 11px 6px 0 0;
        color: #DF0C02;
        box-shadow: 2px 1px 4px rgb(226, 211, 217);
        font-style: normal;
        font-weight: 600;
        border-radius: 5px;
    }
    .countdown .detail-countdown span img{
        width: 10px;
        display: inline-block;
        margin: 0 13px 0 6px;
    }

    .main-top .hidden {
        visibility:hidden;
    }
    .main-foot {
        position:absolute;
        bottom:1px;
        width:100%;
        height:50%;
        background: url(../../static/images/bg-lottery-bottom.jpg) no-repeat top center;
        background-size: 100% 100%;
        box-sizing:border-box;
        -webkit-transition: -webkit-transform .2s ease;
        text-align: center;
    }
    .main-foot .footer {
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 9vh;
        z-index: 8;
    }
    .thanks-tips {
        position: relative;
        font-size: 23px;
        margin-top: 7%;
        color: #ec0c0c;
        overflow: hidden;
        opacity: 0;
        -webkit-transform: translateY(-30px);
        -webkit-transition: all .5s;
        -moz-transition: all .5s;
        transition: all .5s;
        -webkit-backface-visibility: hidden;
    }
    .thanks-tips.show {
        opacity: 1;
        -webkit-transform: translateY(0);
        -webkit-transition: all .5s;
        -moz-transition: all .5s;
        transition: all .5s;
        -webkit-backface-visibility:hidden;
    }
    .fail-tips {
        width: 100%;
        text-align: center;
    }
    .fail-tips * {
        font-size: 20px;
        font-weight: bolder;
        color: #FFCDED;
        font-style: normal;
        text-shadow: 0 0 10px rgba(255,255,255,.5);
    }
    .fail-tips i {
        display: inline-block;
        font-size: 32px;
        margin: 0 8px;
        font-weight: bolder;
        color: #AF0070;
        font-style: normal;
        text-shadow: 1px 0px 0px #FFF, -1px 0px 0px #FFF, 0px 1px 0px #FFF, 0px -1px 0px #FFF !important;
        -webkit-animation: tada 2s 0s infinite ease-in-out;
        -webkit-transform-origin: bottom;
        -webkit-animation-fill-mode: both;
    }
    @-webkit-keyframes btn-show {
        0% { -webkit-transform: scale(0); }
        100% { -webkit-transform: scale(1); }
    }
    @keyframes btn-show {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
    }
    @-webkit-keyframes tada {
        0% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1);
        }
        5%,10% {
            -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
            transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
        }
        15%,25%,35%,45% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
        }
        20%,30%,40% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
        }
        50% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1);
        }
        100% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1);
        }
    }
    @keyframes tada {
        0% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1)
        }
        5%,10% {
            -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
            transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
        }
        15%,25%,35%,45% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
        }
        20%,30%,40% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
        }
        50% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1)
        }
        100% {
            -webkit-transform: scale3d(1,1,1);
            transform: scale3d(1,1,1)
        }
    }
    .visibility{
        visibility: hidden;
    }
    .link-out{
        position: relative;
        display: block;
        width: 100%;
        text-align: center;
        margin-top: 3%;
        color: #fff;
        font-size: 17px;
    }
    .link-out p{
        display: inline-block;
        position: relative;
    }
    .link-out p:before{
        content: "";
        background: url("../../static/images/icon-link.png") 0 0 no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        position: absolute;
        width: 40px;
        height: 40px;
        vertical-align: middle;
        left: -50px;
        top: -15px;
        -webkit-animation-name: wobble;
        animation-name: wobble;
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        animation-iteration-count:infinite;
        -webkit-animation-iteration-count:infinite;
    }
    @-webkit-keyframes wobble {
        0% {
            -webkit-transform: none;
            transform: none;
        }

        15% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -7deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -7deg);
        }

        30% {
            -webkit-transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
            transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
        }

        45% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -5deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }

        60% {
            -webkit-transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
            transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
        }

        75% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -3deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }

        100% {
            -webkit-transform: none;
            transform: none;
        }
    }

    @keyframes wobble {
        0% {
            -webkit-transform: none;
            transform: none;
        }

        15% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -7deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -7deg);
        }

        30% {
            -webkit-transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
            transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
        }

        45% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -5deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }

        60% {
            -webkit-transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
            transform: translate3d(0%, 0, 0) rotate3d(0, 0, 1, 5deg);
        }

        75% {
            -webkit-transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -3deg);
            transform: translate3d(-0%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }

        100% {
            -webkit-transform: none;
            transform: none;
        }
    }
    @media screen and (min-device-width:320px)
    and (max-device-height:500px)
    and (orientation:portrait)
    and (-webkit-min-device-pixel-ratio:2) {
        .home-box .bg-yao {
            width: 80%;
            left: 10%;
        }
    }

    /* iPhone5 */
    @media screen and (device-width: 320px)
    and (device-height : 568px){
    }

    @media screen and (device-width : 414px)
    and (device-height:736px) {
        .home-box .yao-top {
            bottom: -1px;
        }
        .home-box .yao-bottom {
            top: 0;
        }
    }


    /*弹幕-s*/
    .comment_item{
        color: #FF6B23;
        padding: 2px 5px;
    }
    .comments {
        position: relative;
        z-index: 9;
    }
    .c_head_img {
        overflow: hidden;
        float: left;
        margin-left: 10px;
        color: inherit;
    }
    .comment {
        height: 28px;
        line-height: 50px;
        border-radius: 2px;
        margin-left: 10px;
        padding: 0 14px ;
        padding-right: 20px;
        color: #FFFFFF!important;
    }
    /*弹幕-e*/
</style>
