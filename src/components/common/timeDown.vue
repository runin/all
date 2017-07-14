<template>
    <div id="countDown">
        <section v-if="fail" class="fail-tips">
            <p>跟着我的节奏<i>摇</i>起来</p>
        </section>
        <section class="countdown" v-if="countdown">
            <span class="countdown-tip">
                <img v-if="imagesTips" v-bind:src='src'>
                <label v-if="endTips">{{ tip }}</label>
            </span>
            <span v-if="detailCountdown" class="detail-countdown" v-bind:endTime='endTime' v-html="time"></span>
        </section>
        <loading v-if="isLoading"></loading>
    </div>
</template>

<script>
  import api from '@/api/api'
  import loading from './loading.vue'

  export default{
    name: 'countDown',
    components: {
      'loading': loading
    },
    data () {
      return {
        time: '',
        flag: false,
        imagesTips: true,
        detailCountdown: true,
        endTips: false,
        src: '',
        tip: '正在倒计时',
        endTime: '2017-07-13 11:06:00',
        isLoading: true,
        nowTime: null,
        dec: 0,
        repeatLoad: true,
        fail: false,
        safeFlag: false,
        pingFlag: null,
        countdown: true,
        lotteryImgList: [],
        isCanShake: false,
        type: 2
      }
    },
    mounted () {
      this.lotteryRoundPort()
    },
    methods: {
      init () {
        this.lotteryRoundPort()
      },
      countDown () {
        let time = setInterval(() => {
          if (this.flag === true) {
            clearInterval(time)
          }
          this.runTime()
        }, 100)
      },
      runTime () {
        const endTime = new Date(this.endTime)
        const nowTime = new Date()
        let leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
        let d = parseInt(leftTime / (24 * 60 * 60))
        let h = this.formate(parseInt(leftTime / (60 * 60) % 24))
        let m = this.formate(parseInt(leftTime / 60 % 60))
        let s = this.formate(parseInt(leftTime % 60))
        if (leftTime <= 0) {
          this.flag = true
          this.timeEnd()
        }
        let dString = d.toString().split('')
        let hString = h.toString().split('')
        let mString = m.toString().split('')
        let sString = s.toString().split('')
        let dayDom = `<label class="${d ? '' : 'none'}"><i>${dString[0]}</i><i>${dString[1]}</i></label><img class="${d ? '' : 'none'}" src="../../../static/images/dot.png">`
        let hourDom = `<label class="${h ? '' : 'none'}"><i>${hString[0]}</i><i>${hString[1]}</i></label><img class="${h ? '' : 'none'}" src="../../../static/images/dot.png">`
        let minuteDom = `<label><i>${mString[0]}</i><i>${mString[1]}</i></label>`
        let secondDom = `<label><i>${sString[0]}</i><i>${sString[1]}</i></label>`
        let dotDom = `<img src="../../../static/images/dot.png">`
        this.time = `${dayDom}${hourDom}${minuteDom}${dotDom}${secondDom}`
      },
      formate (time) {
        if (time >= 10) {
          return time
        } else {
          return `0${time}`
        }
      },
      timeEnd: function () {
        this.tip = '倒计时结束'
        this.imagesTips = false
        this.endTips = true
        this.detailCountdown = false
      },
      lotteryRoundPort: function () {
        let that = this
        api.lotteryRound().then(function (data) {
          if (data.result === true) {
            that.isLoading = false
            that.nowTime = window.timeTransform(data.sctm)
            let nowTimeStemp = new Date().getTime()
            that.dec = nowTimeStemp - data.sctm
            that.currentPrizeAct(data)
          } else {
            if (that.repeatLoad) {
              that.repeatLload = false
              setTimeout(function () {
                that.lotteryRoundPort()
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
          that.countdown = false
          that.fail = true
          that.$emit('safeFlagFunChild', that.safeFlag = true)
        } else if (flag === 'off') {
          clearTimeout(that.pingFlag)
          that.pingFlag = null
          that.lotteryRoundPort()
          that.fail = false
          that.countdown = true
          that.$emit('safeFlagFunChild', that.safeFlag = false)
        } else {
          that.safeLotteryMode('off')
        }
        that.isLoading = false
      },
      ping: function () {
        let that = this
        api.ping().then(function (data) {
          if (data.t) that.safeLotteryMode('off')
        })
      },
      checkPing: function () {
        let that = this
        let delay = Math.ceil(60000 * 2 * Math.random() + 60000 * 1)
        that.pingFlag = setTimeout(function () {
          clearTimeout(that.pingFlag)
          that.ping()
          that.checkPing()
        }, delay)
      },
      change: function () {
        let that = this
        that.$emit('canShakeFunChild', that.isCanShake = false)
        that.countdown = true
        that.detailCountdown = false
        that.tip = '摇奖已结束,下期再战！'
        that.isLoading = false
      },
      currentPrizeAct: function (data) {
        //  获取抽奖活动
        let that = this
        let nowTimeStr = that.nowTime
        let prizeActListAll = data.la
        let prizeLength = 0
        let prizeActList = []
        let day = nowTimeStr.split(' ')[0]
        // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
        let lastLotteryEtime = prizeActListAll[prizeActListAll.length - 1].pd + ' ' + prizeActListAll[prizeActListAll.length - 1].et
        let lastLotteryNtime = prizeActListAll[prizeActListAll.length - 1].nst
        let crossDay = window.timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(' ')[0]
        let minCrossDay = crossDay + ' 00:00:00'
        let maxCrossDay = window.timeTransform(new Date(minCrossDay).getTime() + window.crossdayLimit)
        if (window.comptime(lastLotteryNtime, minCrossDay) <= 0 && window.comptime(lastLotteryNtime, maxCrossDay) >= 0) {
          that.crossLotteryFlag = true
        } else {
          that.crossLotteryFlag = false
        }

        if (prizeActListAll && prizeActListAll.length > 0) {
          for (let i = 0; i < prizeActListAll.length; i++) {
            if (prizeActListAll[i].pd === day) {
              prizeActList.push(prizeActListAll[i])
            }
          }
        }
        that.pal = prizeActList
        prizeLength = prizeActList.length
        if (prizeActList.length > 0) {
          //  如果最后一轮结束
          if (window.comptime(prizeActList[prizeLength - 1].pd + ' ' + prizeActList[prizeLength - 1].et, nowTimeStr) >= 0) {
            if (that.crossLotteryFlag) {
              that.$emit('typeFunChild', that.type = 1)
              that.crossCountdown(prizeActList[prizeLength - 1].nst)
            } else {
              that.$emit('typeFunChild', that.type = 3)
              that.endType = 3
              that.change()
            }
            return
          }
          //  config微信jssdk
//            api.wxConfig()
          for (let i = 0; i < prizeActList.length; i++) {
            let beginTimeStr = prizeActList[i].pd + ' ' + prizeActList[i].st
            let endTimeStr = prizeActList[i].pd + ' ' + prizeActList[i].et
            that.index = i
            that.isLoading = false
            //  在活动时间段内且可以抽奖
            if (window.comptime(nowTimeStr, beginTimeStr) <= 0 && window.comptime(nowTimeStr, endTimeStr) >= 0) {
              if (i < prizeActList.length - 1) {
                let nextBeginTimeStr = prizeActList[i + 1].pd + ' ' + prizeActList[i + 1].st
                if (window.comptime(endTimeStr, nextBeginTimeStr) <= 0) {
                  that.endType = 2
                  // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                  that.lastRound = false
                  that.nextPrizeAct = prizeActList[i + 1]
                } else {
                  // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                  that.endType = 1
                }
              } else {
                // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                that.endType = 3
                that.lastRound = true
              }
              // me.initComponent();
              that.nowCountdown(prizeActList[i])
              return
            }
            if (window.comptime(nowTimeStr, beginTimeStr) > 0) {
              that.beforeCountdown(prizeActList[i])
              return
            }
          }
        } else {
          that.safeLotteryMode('on')
          return
        }
      },
      // 摇奖开启倒计时
      beforeCountdown: function (prizeActList) {
        let that = this
        that.$emit('canShakeFunChild', that.isCanShake = false)
        that.$emit('typeFunChild', that.type = 1)
        let beginTimeStr = prizeActList.pd + ' ' + prizeActList.st
        let beginTimeLong = window.timestamp(beginTimeStr)
        beginTimeLong += that.dec
        that.endTime = beginTimeLong
        that.detailCountdown = true
        that.tip = '距离摇奖开始还有'
        that.src = '../../../static/images/before.png'
        that
        that.countDown()
        that.countdown = true
        if (prizeActList.bi.length > 0) {
          that.lotteryImgList = prizeActList.bi.split(',')
        }
        that.isLoading = false
//          if($("body").attr('data-type') == 'lottery') toUrl("recommend.html")
      },
      // 摇奖结束倒计时
      nowCountdown: function (prizeActList) {
        let that = this
        that.$emit('canShakeFunChild', that.isCanShake = true)
        that.$emit('typeFunChild', that.type = 2)
        var endTimeStr = prizeActList.pd + ' ' + prizeActList.et
        var beginTimeLong = window.timestamp(endTimeStr)
        beginTimeLong += that.dec
        that.endTime = beginTimeLong
        that.detailCountdown = true
        that.tip = '距离摇奖结束还有'
        that.src = '../../../static/images/end.png'
        that.countDown()
        that.countdown = true
        that.index++
        if (prizeActList.bi.length > 0) {
          that.lotteryImgList = prizeActList.bi.split(',')
        }
        that.isLoading = false
//          if($("body").attr('data-type') == 'lottery') return
//          toUrl("lottery.html")
      },
      // 跨天摇奖开启倒计时
      crossCountdown: function (nextTime) {
        let that = this
        that.$emit('canShakeFunChild', that.isCanShake = false)
        that.crossLotteryFlag = false
        that.crossLotteryCanCallback = true
        that.$emit('typeFunChild', that.type = 1)
        let beginTimeLong = window.timestamp(nextTime)
        beginTimeLong += that.dec
        that.endTime = beginTimeLong
        that.detailCountdown = true
        that.tip = '距离摇奖开始还有'
        that.countDown()
        that.countdown = true
//          if($("body").attr('data-type') == 'lottery') toUrl("recommend.html")
        that.isLoading = false
      }
    }
  }
</script>

<style>
    .countdown{
        position: relative;
        margin: 12% auto 0;
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
        background: url(../../../static/images/count-bbg.png) no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
    }
    .countdown .detail-countdown label i{
        display: inline-block;
        width: 42px;
        height: 64px;
        line-height: 64px;
        background: url(../../../static/images/icon-num-bg.png) no-repeat;
        background-size: 100% 100%;
        margin: 11px 6px 0 0;
        color: #DF0C02;
        box-shadow: 2px 1px 4px rgb(226, 211, 217);
        font-style: normal;
        font-weight: 600;
        border-radius: 5px;
    }
    .countdown .detail-countdown img{
        width: 10px;
        display: inline-block;
        margin: 0 13px 0 6px;
    }
    .fail-tips {
        width: 100%;
        text-align: center;
        margin: 12% auto 0;
    }
    .fail-tips * {
        font-size: 40px;
        font-weight: bolder;
        color: #FFCDED;
        font-style: normal;
        text-shadow: 0 0 10px rgba(255,255,255,.5);
    }
    .fail-tips i {
        display: inline-block;
        font-size: 64px;
        margin: 0 8px;
        font-weight: bolder;
        color: #AF0070;
        font-style: normal;
        text-shadow: 1px 0px 0px #FFF, -1px 0px 0px #FFF, 0px 1px 0px #FFF, 0px -1px 0px #FFF !important;
        -webkit-animation: tada 2s 0s infinite ease-in-out;
        -webkit-transform-origin: bottom;
        -webkit-animation-fill-mode: both;
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
</style>

