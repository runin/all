import { Promise } from 'es6-promise'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const api = {}
export default api

api.lotteryRound = function () {
  return Vue.http.jsonp(window.domainUrl + 'api/lottery/round' + window.isDev, {
    jsonpCallback: 'callbackLotteryRoundHandler'
  }).then(api.resultVerify)
}

api.luck = function () {
  return Vue.http.jsonp(window.domainUrl + 'api/lottery/exec/luck' + window.isDev, {
    params: {
      matk: window.matk,
      sn: new Date().getTime() + ''
    },
    timeout: 10000,
    jsonpCallback: 'callbackLotteryLuckHandler'
  }).then(api.resultVerify)
}

api.ping = function () {
  return Vue.http.jsonp(window.domainUrl + 'api/common/time' + window.isDev, {
    jsonpCallback: 'commonApiTimeHandler'
  }).then(function (result) {
    return new Promise(function (resolve, reject) {
      if (result.data) {
        resolve(result.data)
      } else {
        reject('request t is false')
      }
    })
  })
}

// JS Ticket
api.getTicket = function () {
  return Vue.http.jsonp(window.domainUrl + 'mp/jsapiticket' + window.isDev, {
    params: {
      appId: window.mpappid
    },
    jsonpCallback: 'callbackJsapiTicketHandler'
  }).then(api.codeVerify).then(api.wxConfig)
}

api.award = function (params) {
  return Vue.http.jsonp(window.domainUrl + 'api/lottery/award' + window.isDev, {
    params: params,
    jsonpCallback: 'callbackLotteryAwardHandler'
  })
}

api.wxConfig = function (data) {
  return new Promise(function (resolve, reject) {
    var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361'
    var timestamp = Math.round(new Date().getTime() / 1000)
    var url = location.href.split('#')[0]
    var JsSHA = require('jssha')
    var shaObject = new JsSHA('SHA-1', 'TEXT')
    shaObject.update('jsapi_ticket=' + data.data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url)
    window.wx.config({
      debug: false,
      appId: window.mpappid,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: shaObject.getHash('HEX'),
      jsApiList: [
        'addCard',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems'
      ]
    })
    window.wx.ready(function () {
      resolve()
    })
    window.wx.error(function () {
      reject('weChat config fail')
    })
  })
}

api.recordUserLog = function (openid, operateDesc, operateDomId, loadingTime, flag) {
  return Vue.http.jsonp(window.domainUrl + 'api/common/reportlog' + window.dev, {
    params: {
      openid: openid,
      operateDesc: encodeURIComponent(operateDesc),
      operateDomId: operateDomId,
      loadingTime: loadingTime,
      flag: flag
    }
  })
}

window.recordUserOperate = function (openid, operateDesc, operateDomId) {
  api.recordUserLog(openid, operateDesc, operateDomId, '', 'false')
}

window.recordUserPage = function (openid, operateDesc, loadingTime) {
  api.recordUserLog(openid, operateDesc, '', loadingTime, 'true')
}

// 验证code
api.codeVerify = function (result) {
  return new Promise(function (resolve, reject) {
    if (result.data && result.data.code === 0) {
      resolve(result)
    } else {
      reject('request code is not 0')
    }
  })
}

// 验证result
api.resultVerify = function (result) {
  return new Promise(function (resolve, reject) {
    if (result.data.result) {
      resolve(result.data)
    } else {
      reject('request result is false')
    }
  })
}
