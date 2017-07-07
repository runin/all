import { Promise } from 'es6-promise'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

const api = {}
const domain_url = window.isDev ? 'http://test.holdfun.cn/portal/' : 'https://yaotv.holdfun.cn/portal/'

// 验证code
api.codeVerify = function(result){
    return new Promise(function(resolve, reject){
        if(result.data && result.data.code == 0){
            resolve(result);
        }else{
            reject('request code is not 0');
        }
    })
}
api.lotteryRound = function () {
    return Vue.http.jsonp( domain_url + 'api/lottery/round' + dev, {
        params: {
            jsonpCallback: 'callbackLotteryRoundHandler'
        }
    }).then(api.codeVerify);
}