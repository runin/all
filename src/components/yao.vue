<template>
    <div id="yao" class="wrap-page">
        <audio preload="auto" ref="audioA" id="audio-a" src="../../static/images/audio-a.mp3" class="preload"></audio>
        <audio preload="auto" ref="audioB" id="audio-b" src="../../static/images/audio-b.mp3" class="preload"></audio>
        <section class="home-box" v-bind:class="{ yao: isYao }">
            <section class="main-top m-t-b">
                <header>
                    <div>
                        <time-down
                                v-on:canShakeFunChild="canShakeFunParent"
                                v-on:safeFlagFunChild="safeFlagFunParent"
                                v-on:typeFunChild="typeFunParent"
                        ></time-down>
                    </div>
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
        <loading v-if="isLoading" v-bind:tips="parentMsg"></loading>
        <show-tips v-if="isshowTips" v-bind:message="parentTips"></show-tips>
    </div>
</template>

<script>
    import api from '@/api/api'
    import copyright from './common/copyright.vue'
    import timeDown from './common/timeDown.vue'
    import loading from './common/loading.vue'
    import showTips from './common/showTips.vue'

    export default {
      name: 'yao',
      components: {
        'copyright': copyright,
        'time-down': timeDown,
        'loading': loading,
        'showTips': showTips
      },
      data: function () {
        return {
          isLoading: false,
          isshowTips: false,
          parentMsg: '努力加载中...',
          parentTips: '别灰心，继续加油',
          isYao: false,
          isCanShake: false,
          safeFlag: false,
          type: 2
        }
      },
      methods: {
        init () {
          this.keyDown()
        },
        canShakeFunParent (data) {
          this.isCanShake = data
          console.log('isCanShake', this.isCanShake)
        },
        safeFlagFunParent (data) {
          this.safeFlag = data
          console.log('safeFlag', this.safeFlag)
        },
        typeFunParent (data) {
          this.type = data
          console.log('type', this.type)
        },
        keyDown () {
          let that = this
          document.onkeydown = function (e) {
            let keycode = e.which
            if (keycode === 32) {
              that.shakeListener()
            }
          }
        },
        shakeListener () {
          let that = this
          if (!that.safeFlag) {
            if (that.isCanShake) {
              that.isCanShake = false
            } else {
              return
            }
            if (that.type !== 2) {
              return
            }
          }
          that.$refs.audioA.play()

          that.isYao = true
          setTimeout(() => {
            that.isYao = false
          }, 1200)

          that.parentMsg = '抽奖中，请稍后...'
          that.isLoading = true

          if (!window.openid || window.openid === 'null' || that.safeFlag === true) {
            setTimeout(() => {
              that.fill(null)// 摇一摇
            }, 1500)
          } else {
            setTimeout(() => {
              that.drawlottery()
            }, 1500)
          }
        },
        drawlottery: function () {
          let that = this
          let sn = new Date().getTime() + ''
//          api.recordUserOperate(window.openid, '调用抽奖接口', 'doLottery')
          api.luck().then(function (data) {
            if (data.result) {
              if (data.sn === sn) {
                sn = new Date().getTime() + ''
                that.fill(data)
              }
            } else {
              sn = new Date().getTime() + ''
              that.fill(null)
            }
          }, function () {
            sn = new Date().getTime() + ''
            that.fill(null)
          })
//          api.recordUserPage(window.openid, '调用抽奖接口', 0)
        },
        fill: function (data) {
          var that = this
          if (data === null || data.result === false || data.pt === 0) {
            setTimeout(() => {
              // H.dialog.thanks.open(data);
              that.thanks()
            }, 1500)
            return
          } else {
            that.$refs.audioA.pause()
            that.$refs.audioB.play()
            that.showDialog(data)
          }
        },
        thanks () {
          let that = this
          that.isLoading = false
          that.isCanShake = true
          let tips = ''
          if (window.thanksTips) {
            tips = '不纯不抢，继续来战，加油吧~'
          } else {
            tips = window.thanksTips[window.getRandomArbitrary(0, window.thanksTips.length)]
          }
          that.isshowTips = true
          that.parentTips = tips
        }
      },
      created: function () {
        this.init()
      }
    }
</script>
<style scoped>
    html{
        background: #FFF;
    }
    #yao{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        opacity: 1;
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
    .home-box .main-top, .home-box .main-foot{
        -webkit-transition: -webkit-transform .4s ease;
        -webkit-transform: translate3d(0,0,0);
    }
    .home-box.yao .main-top{
        -webkit-transition: -webkit-transform .2s ease;
        -webkit-transform: translate3d(0,-150px,0);
    }
    .home-box.yao .main-foot{
        -webkit-transition: -webkit-transform .2s ease;
        -webkit-transform: translate3d(0,150px,0);
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
