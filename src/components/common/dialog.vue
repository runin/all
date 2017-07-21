<template>
    <div id="dialog" v-if="isShowDialog">
        <section class="modal" v-bind:class="{ dramaCardDialog: isDramaCardDialog }">
            <section class="dialog">
                <a href="#" class="btn-dialog-close" v-tap="{ methods: close }"></a>
                <fieldset class="dialog-content">
                    <p class="award-keyTips">{{ awardKeyTips }}</p>
                    <div class="bbg"><img class="award-img" v-bind:src='src'></div>
                    <section class="footer" v-if="isShowInput">
                        <section class="input-box">
                            <p><input ref="nameRef" class="name" type="text" placeholder="姓名" v-bind:value='name'></p>
                            <p><input ref="mobileRef" class="phone" type="tel" placeholder="电话" v-bind:value='mobile'></p>
                            <p><input ref="addressRef" class="address" v-if="isAddress" type="text" placeholder="地址" v-bind:value='address'></p>
                        </section>
                    </section>
                    <section class="btn-lottery-box">
                        <a href="#" class="btn-lottery" v-tap="{ methods: award }">立即领取</a>
                    </section>
                </fieldset>
            </section>
        </section>;
    </div>
</template>

<script>
  import api from '@/api/api'
  import {Toast} from 'vue-ydui/dist/lib.rem/dialog'
  export default {
    name: 'dialog',
    data () {
      return {
        isShowDialog: true,
        isFocus: false,
        isAddress: false,
        isShowInput: false,
        isDramaCardDialog: false,
        awardKeyTips: '',
        src: '',
        name: '',
        mobile: '',
        address: '',
        ci: null,
        ts: null,
        si: null,
        sto: null
      }
    },
    props: ['data'],
    methods: {
      init () {
        let that = this
        that.update()
      },
      close () {
        let that = this
        that.isShowDialog = false
        that.$emit('isLoadingChild', that.isLoading = false)
        that.$emit('canShakeFunChild', that.isCanShake = true)
      },
      update () {
        let that = this
        let data = that.data
        if (data.result) {
          that.src = data.pi
          switch (data.pt) {
            case 1: // 实物奖品
              that.isShowInput = true
              that.name = data.rn
              that.mobile = data.ph
              that.address = data.ad
              if (data.cu) {
                that.isAddress = true
              } else {
                that.isAddress = false
              }
              break
            case 18: // 剧集卡牌
              that.isDramaCardDialog = true
              that.awardKeyTips = '恭喜您获得' + data.pn.split('-')[1] + '号卡牌'
              break
            case 7: // 卡劵奖品
              that.ci = data.ci
              that.ts = data.ts
              that.si = data.si
              break
          }
        }
      },
      verify (params) {
        let that = this
        let refs = that.$refs
        let nameVal = refs.nameRef.value
        let mobileVal = refs.mobileRef.value

        if (nameVal.length > 20 || nameVal.length === 0) {
          Toast({
            mes: '请填写您的姓名！',
            timeout: 1200
          })
          refs.nameRef.focus()
          return false
        } else if (!/^\d{11}$/.test(mobileVal)) {
          Toast({
            mes: '请填写正确手机号！',
            timeout: 1200
          })
          refs.mobileRef.focus()
          return false
        }
        if (that.isAddress) {
          let addressVal = refs.addressRef.value
          if (addressVal.length < 8 || addressVal.length > 80 || addressVal.length === 0) {
            Toast({
              mes: '请填写您的详细地址！',
              timeout: 1200
            })
            refs.addressRef.focus()
            return false
          }
          that.address = addressVal
        }

        that.name = nameVal
        that.mobile = mobileVal
        return true
      },
      award () {
        let that = this
        let data = that.data
        let params = {
          oi: window.openid,
          nn: window.nickname ? encodeURIComponent(window.nickname) : '',
          hi: window.headimgurl || ''
        }
        if (data.pt === 1 && that.verify()) {
          params.rn = that.name ? encodeURIComponent(that.name) : ''
          params.ph = that.mobile || ''
          if (data.cu) params.ad = that.address ? encodeURIComponent(that.address) : ''
        } else if (data.pt === 7) {
          that.$emit('canShakeFunChild', that.isCanShake = false)
          let flag = true
          if (flag) {
            flag = false
            that.$emit('isParentMsgChild', that.parentMsg = '领奖中，请稍后...')
            that.$emit('isLoadingChild', that.isLoading = true)
            that.sto = setTimeout(function () {
              that.$emit('canShakeFunChild', that.isCanShake = true)
              that.$emit('isLoadingChild', that.isLoading = false)
            }, 15000)
            setTimeout(function () {
              that.wxCard(params)
            }, 1000)
          }
          return
        }
        api.award(params).then(function () {
          Toast({
            mes: '领取成功！',
            timeout: 1200
          })
          that.isShowDialog = false
        })
      },
      wxCard (params) {
        let that = this
        window.wx.addCard({
          cardList: [{
            cardId: that.ci,
            cardExt: '{\'timestamp\':\'' + that.ts + '\',\'signature\':\'' + that.si + '\'}'
          }],
          success: function (res) {
            that.$emit('canShakeFunChild', that.isCanShake = true)

            api.award(params).then(function () {
              Toast({
                mes: '领取成功！',
                timeout: 1200
              })
              that.isShowDialog = false
            })
          },
          fail: function (res) {
            that.$emit('canShakeFunChild', that.isCanShake = true)
            that.$emit('isLoadingChild', that.isLoading = false)
//            recordUserOperate(openid, res.errMsg, "card-fail");
          },
          complete: function () {
            that.sto && clearTimeout(that.sto)
            that.$emit('canShakeFunChild', that.isCanShake = true)
            that.$emit('isLoadingChild', that.isLoading = false)
          },
          cancel: function () {
            that.$emit('canShakeFunChild', that.isCanShake = true)
            that.$emit('isLoadingChild', that.isLoading = false)
          }
        })
      }
    },
    created: function () {
      this.init()
    }
  }
</script>

<style scoped>
    /* 通用弹层样式_S */
    .modal {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        color: #FFF;
        text-align: center;
        overflow: hidden;
        overflow-y: scroll;
    }
    .modal:after {
        content:'';
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.75);
        z-index:99;
    }
    .modal .dialog {
        position: absolute;
        width: 499px!important;
        height: 765px!important;
        z-index: 999!important;
        left: -webkit-calc((100% - 499px)/2)!important;
        left: calc((100% - 499px)/2)!important;
        top: -webkit-calc((100% - 765px)/2)!important;
        top: calc((100% - 765px)/2)!important;
    }
    .modal .dialog .btn-dialog-close {
        display: block;
        position: absolute;
        top: -10px;
        right: -12px;
        width: 40px;
        height: 40px;
        background: url(../../assets/images/icon-close.png) no-repeat;
        background-size: 100% 100%;
        z-index: 9999999999;
    }
    .modal .dialog .dialog-content {
        border: 2px solid #FFF;
        background: #e1e1e1; /* Old browsers */
        background: -webkit-linear-gradient(top,  #e1e1e1 0%,#e9e9e9 37%,#f5f5f5 68%,#fcfcfc 100%);
        background: linear-gradient(to bottom,  #e1e1e1 0%,#e9e9e9 37%,#f5f5f5 68%,#fcfcfc 100%);
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        overflow: hidden;
        z-index: 999;
        text-align: center;
        border-radius: 15px;
        display: block;
    }
    .modal .dialog .dialog-content .tlt img{
        width: 150px;
        margin: 0 10px;
    }
    .modal .dialog .dialog-content .award-luckTips img{
        width: 73%;
        margin: -15px auto 10px;
    }
    .modal .dialog .dialog-content .bbg{
        margin: 15px 26px;
        padding: 13px;
        background: #e1e1e1; /* Old browsers */
        background: -moz-linear-gradient(45deg,  #e1e1e1 0%, #e9e9e9 37%, #f5f5f5 68%, #fcfcfc 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(45deg,  #e1e1e1 0%,#e9e9e9 37%,#f5f5f5 68%,#fcfcfc 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(45deg,  #e1e1e1 0%,#e9e9e9 37%,#f5f5f5 68%,#fcfcfc 100%);
        border-radius: 15px;
        box-shadow: 1px 1px 1px 1px rgb(212, 203, 186);
    }
    .modal .dialog .dialog-content .footer{
        width: 100%;
        position: absolute;
        bottom: 14%;
    }
    .modal .dialog .dialog-content .award-keyTips {
        width: 100%;
        margin: 9% auto;
        font-size: 18px;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: none;

    }
    .modal .dialog .dialog-content .input-box {
        width: 100%;
        font-size: 15px;
        color: #FFF;
        margin: 5px auto 3px;
    }
    .modal .dialog .dialog-content .input-box h5 {
        width: 100%;
        text-align: center;
        font-size: 14px;
        margin: 3px auto;
    }
    .modal .dialog .dialog-content .input-box p {
        /*display: inline-block;*/
        color: #9B6115;
        text-shadow: #FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0;
        -webkit-text-shadow:#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0;
        font-size: 17px;
        font-weight: bold;
    }
    .modal .dialog .dialog-content .input-box span {
        display: inline-block;
    }
    .modal .dialog .dialog-content .input-box input {
        display: inline-block;
        width: 83%;
        padding: 6px 8px;
        border: 0 none;
        border-radius: 6px;
        font-size: 28px;
        color: #666666!important;
        background: #FFF;
        background-size: 100% 100%;
        margin-bottom: 5px;
        vertical-align: baseline;
    }
    input::-webkit-input-placeholder {
        color: #bbb3b3 !important;
    }
    .modal .dialog .dialog-content .btn-lottery {
        display: inline-block;
        margin: 0 6px;
        width: 263px;
        height: 63px;
        background: url(../../assets/images/btn.png) no-repeat;
        background-size: 100% 100%;
        line-height: 63px;
        border-radius: 30px;
        font-weight: bold;
        color: #DF0C02;
        font-size: 30px;
        border: 1px solid #DF0200;
    }
    .modal .dialog .dialog-content .btn-lottery-box {
        width: 100%;
        position: absolute;
        bottom: 2%;
    }
    .modal .dialog .dialog-content .qrcode-box p {
        position: absolute;
        width: 100%;
        height: 36px;
        left: 0;
        bottom: 0;
        font-size: 13px;
        font-weight: bolder;
        color: #6b0001;
        overflow: hidden;
        text-align: center;
        padding: 0 6%;
    }

    /* 通用弹层样式_E */

    /* 剧集卡牌样式_S */
    .dramaCardDialog .dialog .dialog-content .award-keyTips {
        font-size: 32px;
        font-weight: bold;
        display: -webkit-inline-box;
        color: #333;
    }
    .dramaCardDialog .dialog .dialog-content .btn-lottery-box {
        bottom: 6%;
    }
    /* 剧集卡牌样式_E */
</style>
