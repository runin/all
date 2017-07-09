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
