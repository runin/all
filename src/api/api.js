import { Promise } from 'es6-promise'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const api = {}
const domainUrl = window.isDev ? 'http://test.holdfun.cn/portal/' : 'https://yaotv.holdfun.cn/portal/'
export default api

api.lotteryRound = function () {
  return Vue.http.jsonp(domainUrl + 'api/lottery/round' + window.isDev, {
    jsonpCallback: 'callbackLotteryRoundHandler'
  }).then(api.resultVerify)
}

api.luck = function () {
  return Vue.http.jsonp(domainUrl + 'api/lottery/exec/luck' + window.isDev, {
    params: {
      matk: window.matk,
      sn: new Date().getTime() + ''
    },
    timeout: 10000,
    jsonpCallback: 'callbackLotteryLuckHandler'
  }).then(api.resultVerify)
}

api.ping = function () {
  return Vue.http.jsonp(domainUrl + 'api/common/time' + window.isDev, {
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

api.recordUserLog = function (openid, operateDesc, operateDomId, loadingTime, flag) {
  return Vue.http.jsonp(domainUrl + 'api/common/reportlog' + window.dev, {
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
