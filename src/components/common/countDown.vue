<template>
    <div id="countDown">
        <section v-if="fail" class="fail-tips">
            <p>跟着我的节奏<i>摇</i>起来</p>
        </section>
        <section class="countdown " v-if="lotteryCountdown">
            <span class="countdown-tip">{{ tip }}</span>
            <span id="detailCountdownId" class="detail-countdown" v-if="detailCountdown" v-bind:etime="etime"></span>
        </section>
        <loading v-if="isLoading"></loading>
    </div>
</template>

<script>
    import api from '@/api/api'
    import loading from './loading.vue'

    export default {
      name: 'countDown',
      components: {
        'loading': loading
      },
      data () {
        return {
          etime: '',
          tip: '',
          isLoading: true,
          fail: false,
          lotteryCountdown: false,
          repeatLoad: true,
          nowTime: null,
          crossLotteryFlag: false, // 跨天摇奖倒计时标识  true为有跨天摇奖 false为没有跨天摇奖
          crossLotteryCanCallback: false,
          pal: null,
          type: 2,
          endType: 1,
          index: 0,
          dec: 0,
          isTimeOver: false
        }
      },
      methods: {
        init: function () {
          let that = this
          console.log(that.$refs)
          that.lotteryRoundPort()
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
            that.fail = true
            that.safeFlag = true
          } else if (flag === 'off') {
            clearTimeout(that.pingFlag)
            that.pingFlag = null
            that.lotteryRoundPort()
            that.fail = false
            that.safeFlag = false
          } else {
            that.safeLotteryMode('off')
          }
          that.isLoading = false
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
          that.isCanShake = false
          that.lotteryCountdown = true
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
                that.type = 1
                that.crossCountdown(prizeActList[prizeLength - 1].nst)
              } else {
                that.type = 3
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
          that.isCanShake = false
          that.type = 1
          let beginTimeStr = prizeActList.pd + ' ' + prizeActList.st
          let beginTimeLong = window.timestamp(beginTimeStr)
          beginTimeLong += that.dec
          that.etime = beginTimeLong
          that.detailCountdown = true
          that.tip = '距离摇奖开始还有'
          that.count_down()
          that.lotteryCountdown = true
          if (prizeActList.bi.length > 0) {
            that.lotteryImgList = prizeActList.bi.split(',')
          }
          that.downloadImg()
          that.canJump = true
          that.isLoading = false
//          if($("body").attr('data-type') == 'lottery') toUrl("recommend.html")
        },
        // 摇奖结束倒计时
        nowCountdown: function (prizeActList) {
          let that = this
          that.isCanShake = true
          that.type = 2
          var endTimeStr = prizeActList.pd + ' ' + prizeActList.et
          var beginTimeLong = window.timestamp(endTimeStr)
          beginTimeLong += that.dec
          that.etime = beginTimeLong
          that.detailCountdown = true
          that.tip = '距离摇奖结束还有'
          that.count_down()
          that.lotteryCountdown = true
          that.index++
          that.canJump = true
          if (prizeActList.bi.length > 0) {
            that.lotteryImgList = prizeActList.bi.split(',')
          }
          that.downloadImg()
          that.isLoading = false
//          if($("body").attr('data-type') == 'lottery') return
//          toUrl("lottery.html")
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function (nextTime) {
          let that = this
          that.isCanShake = false
          that.crossLotteryFlag = false
          that.crossLotteryCanCallback = true
          that.type = 1
          let beginTimeLong = window.timestamp(nextTime)
          beginTimeLong += that.dec
          that.etime = beginTimeLong
          that.detailCountdown = true
          that.tip = '距离摇奖开始还有'
          that.count_down()
          that.lotteryCountdown = true
          that.canJump = true
//          if($("body").attr('data-type') == 'lottery') toUrl("recommend.html")
          that.isLoading = false
        },
        count_down: function () {
          let that = this
            //  摇奖页倒计时
          document.getElementById('detailCountdownId').each(function () {
            this.countDown({
              etpl: '<label>%H%</label>' + '<span><img src="images/dot.png"></span>' + '<label>%M%</label>' + '<span><img src="images/dot.png"></span>' + '<label>%S%</label>', // 还有...结束
              stpl: '<label>%H%</label>' + '<span><img src="images/dot.png"></span>' + '<label>%M%</label>' + '<span><img src="images/dot.png"></span>' + '<label>%S%</label>', // 还有...开始
              sdtpl: '',
              otpl: '',
              otCallback: function () {
                if (that.canJump) {
                  that.canJump = false
                  if (that.crossLotteryCanCallback) {
                    if (!that.isTimeOver) {
                      let delay = Math.ceil(1000 * Math.random() + 500)
                      that.isTimeOver = true
                      that.crossLotteryCanCallback = false
                      that.tip = '请稍后...'
                      that.detailCountdown = false
                      that.isLoading = true
                      setTimeout(function () {
                        that.lotteryRoundPort()
                      }, delay)
                    }
                  } else {
                    if (that.type === 1) {
                      //  距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                      if (!that.isTimeOver) {
                        that.isTimeOver = true
                        that.tip = '请稍后...'
                        that.detailCountdown = false
                        that.isLoading = true
                        setTimeout(function () {
                          that.nowCountdown(that.pal[that.index])
                        }, 1000)
                      }
                    } else if (that.type === 2) {
                      //  距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                      if (!that.isTimeOver) {
                        that.isTimeOver = true
                        if (that.index >= that.pal.length) {
                          if (that.crossLotteryFlag) {
                            that.type = 1
                            that.tip = '请稍后...'
                            that.detailCountdown = false
                            that.isLoading = true
                            setTimeout(function () {
                              that.crossCountdown(that.pal[that.pal.length - 1].nst)
                            }, 1000)
                          } else {
                            that.type = 3
                            that.change()
                          }
                          return
                        }
                        that.tip = '请稍后...'
                        that.detailCountdown = false
                        that.isLoading = true
                        var i = that.index - 1
                        if (i < that.pal.length - 1) {
                          var endTimeStr = that.pal[i].pd + ' ' + that.pal[i].et
                          var nextBeginTimeStr = that.pal[i + 1].pd + '' + that.pal[i + 1].st
                          if (window.comptime(endTimeStr, nextBeginTimeStr) <= 0) {
                            // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                            that.endType = 2
                          } else {
                            // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                            that.endType = 1
                          }
                        }
                        setTimeout(function () {
                          if (that.endType === 2) {
                            that.nowCountdown(that.pal[that.index])
                          } else if (that.endType === 1) {
                            that.beforeCountdown(that.pal[that.index])
                          } else {
                            that.change()
                          }
                        }, 1000)
                      }
                    } else {
                      that.isCanShake = false
                    }
                  }
                }
              },
              sdCallback: function () {
                that.isTimeOver = false
              },
              stCallback: function () {}
            })
          })
        }
      },
      created: function () {
        this.init()
      }
    }
</script>

<style scoped>
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
    .countdown .detail-countdown span img{
        width: 10px;
        display: inline-block;
        margin: 0 13px 0 6px;
    }
    .fail-tips {
        width: 100%;
        text-align: center;
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
