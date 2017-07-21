window.getQueryString = function (name, url) {
  if (!url) url = location.href
  let target = url.split('?')
  if (url.indexOf('?') >= 0) {
    let temp = ''
    for (var i = 1; i < target.length; i++) {
      if (i === 1) {
        temp = target[i]
      } else {
        temp = temp + '&' + target[i]
      }
    }
    var currentSearch = decodeURIComponent(temp)
    if (currentSearch !== '') {
      var paras = currentSearch.split('&')
      for (var i = 0, l = paras.length, items; i < l; i++) {
        if (paras[i].indexOf('#') >= 0) {
          paras[i] = paras[i].split('#')[0]
        }
        items = paras[i].split('=')
        if (items[0] === name) return items[1]
      }
      return ''
    } else {
      return ''
    }
  } else {
    return ''
  }
}

window.timeTransform = function (TimeMillis) {
  let data = new Date(TimeMillis)
  let year = data.getFullYear()
  let month = data.getMonth() >= 9 ? (data.getMonth() + 1).toString(): '0' + (data.getMonth() + 1)
  let day = data.getDate() > 9 ? data.getDate().toString(): '0' + data.getDate()
  let hours = data.getHours() > 9 ? data.getHours().toString(): '0' + data.getHours()
  let minutes = data.getMinutes() > 9 ? data.getMinutes().toString(): '0' + data.getMinutes()
  let ss = data.getSeconds() > 9 ? data.getSeconds().toString(): '0' + data.getSeconds()
  let time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + ss
  return time
}

window.str2date = function (str) {
  str = str.replace(/-/g, '/')
  return new Date(str)
}

window.timestamp = function (str) {
  var timestamp = Date.parse(window.str2date(str))
  return timestamp
}

window.comptime = function (beginTime, endTime) {
  let beginTimes = beginTime.substring(0, 10).split('-')
  let endTimes = endTime.substring(0, 10).split('-')
  beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19)
  endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19)
  let a = (window.timestamp(endTime) - window.timestamp(beginTime)) / 3600 / 1000
  if (a < 0) {
    return -1
  } else if (a > 0) {
    return 1
  } else if (a === 0) {
    return 0
  } else {
    return -2
  }
}

window.getRandomArbitrary = function (min, max) {
  return parseInt(Math.random() * (max - min) + min)
}

window.is_android = function () {
  var ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('android') > -1
}

window.add_yao_prefix = function (url) {
  return 'http://yao.qq.com/tv/entry?redirect_uri=' + encodeURIComponent(url)
}

window.add_param = function (sourceUrl, parameterName, parameterValue, replaceDuplicates) {
  if ((sourceUrl == null) || (sourceUrl.length === 0)) {
    sourceUrl = document.location.href
  }
  var urlParts = sourceUrl.split('?')
  var newQueryString = ''
  if (urlParts.length > 1) {
    var parameters = urlParts[1].split('&')
    for (var i = 0; (i < parameters.length); i++) {
      var parameterParts = parameters[i].split('=')
      if (!(replaceDuplicates && parameterParts[0] === parameterName)) {
        if (newQueryString === '') {
          newQueryString = '?'
        } else {
          newQueryString += '&'
        }
        newQueryString += parameterParts[0] + '=' + parameterParts[1]
      }
    };
  }
  if (parameterValue !== null) {
    if (newQueryString === '') {
      newQueryString = '?'
    } else {
      newQueryString += '&'
    }
    newQueryString += parameterName + '=' + parameterValue
  }
  return urlParts[0] + newQueryString
}

window.getUrl = function (openid) {
  var href = window.location.href
  href = window.add_param(window.share_url.replace(/[^\/]*\.html/i, 'index.html'), 'resopenid', hex_md5(openid), true)
  href = window.add_param(href, 'from', 'share', true)
  href = window.delQueStr(href, 'openid')
  href = window.delQueStr(href, 'matk')
  href = window.delQueStr(href, 'markJump')
  href = window.delQueStr(href, 'headimgurl')
  href = window.delQueStr(href, 'nickname')
  return window.add_yao_prefix(href)
}
$(function () {
  $.ajax({
    type: 'get',
    async: false,
    url: window.domainUrl + 'api/common/versioncheck' + window.isDev,
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'commonApiVersionHandler',
    success: function (data) {
      if (!data.result) {
        location.href = data.redirect
      }
      window.share_img = data.si
      window.share_title = data.st
      window.share_desc = data.sd
      window.share_group = data.sgt
      window['shaketv'] && shaketv.wxShare(window.share_img, window.share_title, window.share_desc, getUrl(window.openid))
      new Authorize({callBackPage:'index.html'}).init(check_weixin_login());
    },
    error: function () {
      new Authorize({callBackPage:'index.html'}).init(check_weixin_login());
    }
  })
})
