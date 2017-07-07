<template>
    <div id="countDown" v-if="countDownDom">
        <section v-if="fail" class="fail-tips none">
            <p>跟着我的节奏<i>摇</i>起来</p>
        </section>
        <section class="countdown " id="lottery-countdown">
            <span class="countdown-tip"></span>
            <span class="detail-countdown"></span>
        </section>
        <loading v-if="isLoading"></loading>
    </div>
</template>

<script>
    import api from '../api/api'
    import loading from './common/loading.vue'

    export default {
      name: 'countDown',
      components: {
        'loading': loading
      },
      data () {
        return {
          isLoading: false,
          fail: false,
          countDownDom: false
        }
      },
      methods: {
        init: function () {
          let that = this
          that.lotteryRound_port()
        },
        lotteryRound_port: function () {
          let that = this
          api.lotteryRound().then(function (data) {
            if (data.result === true) {
              that.isLoading = false
              that.nowTime = window.timeTransform(data.sctm)
              var nowTimeStemp = new Date().getTime()
              that.dec = nowTimeStemp - data.sctm
              that.roundData = data
              that.currentPrizeAct(data)
            } else {
              if (that.repeat_load) {
                that.repeat_load = false
                setTimeout(function () {
                  that.lotteryRound_port()
                }, 500)
              } else {
                that.change()
              }
            }
          }, function (res) {
            that.safeLotteryMode('on')
          })
        },
        safeLotteryMode: function (flag) {
          var that = this
          if (flag === 'on') {
            that.checkPing()
            that.countDownDom = false
            that.fail = true
            that.safeFlag = true
          } else if (flag === 'off') {
            clearTimeout(that.pingFlag)
            that.pingFlag = null
            that.lotteryRound_port()
            that.countDownDom = true
            that.fail = false
            that.safeFlag = false
          } else {
            that.safeLotteryMode('off')
          }
          that.isLoading = false
        }
      },
      created: function () {

      }
    }
</script>

<style scoped>
    .countdown{
        position: relative
        margin: 2% auto 0
        color: #23c2e0
        font-size: 36px
        width: 100%
        text-align: center
        text-shadow: 0px 1px 0px #fff
        z-index: 9
    }
    .countdown .countdown-tip img{
        width: 37%
        margin-bottom: 19px
    }
    .countdown .detail-countdown{
        display: block
        width: 404px
        height: 85px
        background: url(../../../static/images/count-bbg.png) no-repeat
        background-size: 100% 100%
        margin: 0 auto
    }
    .countdown .detail-countdown label i{
        display: inline-block
        width: 42px
        height: 64px
        line-height: 64px
        background: url(../../../static/images/icon-num-bg.png) no-repeat
        background-size: 100% 100%
        margin: 11px 6px 0 0
        color: #DF0C02
        box-shadow: 2px 1px 4px rgb(226, 211, 217)
        font-style: normal
        font-weight: 600
        border-radius: 5px
    }
    .countdown .detail-countdown span img{
        width: 10px
        display: inline-block
        margin: 0 13px 0 6px
    }
    .fail-tips {
        width: 100%
        text-align: center
    }
    .fail-tips * {
        font-size: 20px
        font-weight: bolder
        color: #FFCDED
        font-style: normal
        text-shadow: 0 0 10px rgba(255,255,255,.5)
    }
    .fail-tips i {
        display: inline-block
        font-size: 32px
        margin: 0 8px
        font-weight: bolder
        color: #AF0070
        font-style: normal
        text-shadow: 1px 0px 0px #FFF, -1px 0px 0px #FFF, 0px 1px 0px #FFF, 0px -1px 0px #FFF !important
        -webkit-animation: tada 2s 0s infinite ease-in-out
        -webkit-transform-origin: bottom
        -webkit-animation-fill-mode: both
    }
    @-webkit-keyframes tada {
        0% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
        5%,10% {
            -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
            transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
        }
        15%,25%,35%,45% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
        }
        20%,30%,40% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
        }
        50% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
        100% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
    }
    @keyframes tada {
        0% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
        5%,10% {
            -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
            transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)
        }
        15%,25%,35%,45% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)
        }
        20%,30%,40% {
            -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
            transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)
        }
        50% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
        100% {
            -webkit-transform: scale3d(1,1,1)
            transform: scale3d(1,1,1)
        }
    }
</style>
