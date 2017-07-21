(function (w) {
  w.matk = $.fn.cookie(w.mpappid + '_matk')
  w.openid = $.fn.cookie(w.mpappid + '_openid')
  w.headimgurl = $.fn.cookie(w.mpappid + '_headimgurl')
  w.nickname = $.fn.cookie(w.mpappid + '_nickname')
  w.expires_in = { expires: 30 }
  w.matk_expires_in = { expires: 1 }
  w.Authorize = function (o) {
    this.mpappid = o && o.mpappid || w.mpappid // mpappid
    this.serviceNo = o && o.serviceNo || w.serviceNo// serviceNo
    this.callBackPage = o && o.callBackPage || ''// 授权之后的回调页面
    this.param = '' // 微信的参数
  }
  w.Authorize.prototype.authorizeUserInfo = function () {
    var that = this
    that.scope = 'snsapi_userinfo' // scope
    that.redirect_uri = window.domainUrl + 'api/mp/auth/snsapi_userinfo' // redirect_uri
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.mpappid + '&redirect_uri=' + encodeURIComponent(that.redirect_uri+'?callBackPage='+this.callBackPage+'&param='+this.param)+ '&response_type=code&scope=' + that.scope +  '&state=' + this.serviceNo + '#wechat_redirect'
  }
  w.Authorize.prototype.authorizeBase = function () {
    var that = this
    that.scope = 'snsapi_base' // scope
    that.redirect_uri = window.domainUrl + 'api/mp/auth/snsapi_base' // redirect_uri
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.mpappid + '&redirect_uri=' + encodeURIComponent(that.redirect_uri+'?callBackPage='+this.callBackPage+'&param='+this.param)+ '&response_type=code&scope=' + that.scope +  '&state=' + this.serviceNo + '#wechat_redirect'
  }
  w.Authorize.prototype.getQueryParam = function (name) {
    var currentSearch = decodeURIComponent(location.search.slice(1))
    if (currentSearch !== '') {
      var paras = currentSearch.split('&')
      for (var i = 0, l = paras.length; i < l; i++) {
        var sindex = paras[i].search('=')
        var tname = paras[i].substring(0, sindex)
        var tval = paras[i].substring(sindex + 1, paras[i].length)
        if (tname === name) {
          return tval
        }
      }
      return ''
    }
    return ''
  }
  w.Authorize.prototype.getParam = function () {
    var jsonobj = {}
    var currentSearch = decodeURIComponent(location.search.slice(1)).split('&')
    for (var i = 0; i < currentSearch.length; i++) {
      var sindex = currentSearch[i].search('=')
      var tname = currentSearch[i].substring(0, sindex)
      var tval = currentSearch[i].substring(sindex + 1, currentSearch[i].length)
      jsonobj[tname] = tval
    }
    this.param =  encodeURIComponent(JSON.stringify(jsonobj))
  }

  w.Authorize.prototype.init = function (fn) {

    this.getParam()
    var that = this
    if (!w.openid || !w.nickname) {
      w.openid = that.getQueryParam('openid')
      w.openid && $.fn.cookie(w.mpappid + '_openid', w.openid, w.expires_in)
      w.nickname = that.getQueryParam('nickname')
      w.nickname && $.fn.cookie(w.mpappid + '_nickname', w.nickname, w.expires_in)
      w.headimgurl = that.getQueryParam('headimgurl')
      w.headimgurl && $.fn.cookie(w.mpappid + '_headimgurl', w.headimgurl, w.expires_in)
      w.matk = that.getQueryParam('matk')
      w.matk && $.fn.cookie(w.mpappid + '_matk', w.matk, w.matk_expires_in)
        if (!w.openid || !w.nickname || !w.matk) {
          that.authorizeUserInfo()
        }
    } else {
      $.fn.cookie(w.mpappid + '_openid', w.openid, w.expires_in)
      $.fn.cookie(w.mpappid + '_nickname', w.nickname, w.expires_in)
      $.fn.cookie(w.mpappid + '_headimgurl', w.headimgurl, w.expires_in)
      if (!w.matk) {
        w.matk = that.getQueryParam('matk')
          if (!w.matk) {
            that.authorizeBase()
          } else {
            $.fn.cookie(w.mpappid + '_matk', w.matk, w.matk_expires_in)
            if (fn) {
              setTimeout(function () {
                  fn()
              }, 50)
            }
          }
      } else {
        if (fn) {
          setTimeout(function () {
              fn()
          }, 50)
        }
      }
    }
  }

  /**
   * 摇电视授权
   * @type {string}
   */
  var yao_shaketv_scope = 'base'
  var shaketv_openid  = $.fn.cookie(shaketv_appid + '_openid')
  var shaketv_matk  = $.fn.cookie(shaketv_appid + '_matk')

  w.check_weixin_login = function() {
    if (!window['shaketv']) {
        return false
    }
    if (!shaketv_openid || !shaketv_matk) {
        shaketv.authorize(shaketv_appid, yao_shaketv_scope, function(data) {
            if (data.errorCode == 0) {
                get_info(data.code)
            }
        })
    } else {
        $.fn.cookie(shaketv_appid + '_openid', shaketv_openid, expires_in)
    }
  }

  var get_info = function(code) {
    $.ajax({
        type : 'GET',
        async : false,
        url : domain_url + 'shaketv/yaotv/userinfo',
        data: {code: code,mpopenid: w.openid},
        dataType : 'jsonp',
        jsonpCallback : 'callbackShaketvYaotvUserinfoHandler',
        success : function(data) {
            if (typeof data.errcode != 'undefined' && data.errcode > 0) {
                return
            }
            shaketv_openid = data.openid
            data.openid && $.fn.cookie(shaketv_appid + '_openid', data.openid, expires_in)
            shaketv_matk = data.matk
            data.matk && $.fn.cookie(shaketv_appid + '_matk', data.matk, matk_expires_in)
        }
    })
  }
})(window)