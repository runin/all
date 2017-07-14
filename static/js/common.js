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

var showTipsFlag = true
window.showTips = function (tips, timer) {
  if (tips === undefined) return
  if (showTipsFlag) {
    showTipsFlag = false
    var winW = $(window).width(), winH = $(window).height(), tipsW = $('.showTips').width(), tipsH = $('.showTips').height(), timer = timer || 1200
    $('.showTips').css().animate({'opacity': '1'}, 300, function () {
      setTimeout(function () {
        $('.showTips').animate({'opacity': '0'}, 100, function () {
          $('.showTips').remove()
          showTipsFlag = true
        })
      }, timer)
    })
  }
}

window.timeTransform = function (TimeMillis) {
  let data = new Date(TimeMillis)
  let year = data.getFullYear()
  let month = data.getMonth() >= 9 ? (data.getMonth() + 1).toString() : '0' + (data.getMonth() + 1)
  let day = data.getDate() > 9 ? data.getDate().toString() : '0' + data.getDate()
  let hours = data.getHours() > 9 ? data.getHours().toString() : '0' + data.getHours()
  let minutes = data.getMinutes() > 9 ? data.getMinutes().toString() : '0' + data.getMinutes()
  let ss = data.getSeconds() > 9 ? data.getSeconds().toString() : '0' + data.getSeconds()
  let time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + ss
  return time
}

window.normalDate = function (stamp, format, zero) {
    var stamp = Number(stamp),
        date = new Date(stamp), formatDate,
        format = format ? format : "yyyy-mm-dd hh:ii:ss",
        zero = (zero === undefined) ? true : zero,
        dateNum = function(num) { return num < 10 ? '0' + num : num; },
        _d = zero ? dateNum : function(s){return s;};
    var year = _d(date.getFullYear()), month = _d(date.getMonth() + 1), day = _d(date.getDate()), hour = _d(date.getHours()), minute = _d(date.getMinutes()), second = _d(date.getSeconds());
    formatDate = format.replace(/yyyy/i, year).replace(/mm/i, month).replace(/dd/i, day).replace(/hh/i, hour).replace(/ii/i, minute).replace(/ss/i, second);
    return formatDate;
};

window.str2date = function(str) {
    str = str.replace(/-/g, '/');
    return new Date(str);
};

window.timestamp = function(str) {
    var timestamp = Date.parse(str2date(str));
    return timestamp;
};

window.dateformat = function(date, format) {
    var z = {
        M : date.getMonth() + 1,
        d : date.getDate(),
        h : date.getHours(),
        m : date.getMinutes(),
        s : date.getSeconds()
    };
    format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
    });
    return format.replace(/(y+)/g, function(v) {
        return date.getFullYear().toString().slice(-v.length)
    })
}

window.dateNum = function(num) {
    return num < 10 ? '0' + num : num;
}

window.add_param = function(sourceUrl, parameterName, parameterValue, replaceDuplicates) {
    if ((sourceUrl == null) || (sourceUrl.length == 0)) {
        sourceUrl = document.location.href
    }
    var urlParts = sourceUrl.split("?")
    var newQueryString = ""
    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&")
        for ( var i = 0; (i < parameters.length); i++) {
            var parameterParts = parameters[i].split("=")
            if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                if (newQueryString == "") {
                    newQueryString = "?"
                } else {
                    newQueryString += "&"
                }
                newQueryString += parameterParts[0] + "=" + parameterParts[1]
            }
        };
    }
    if (parameterValue !== null) {
        if (newQueryString == "") {
            newQueryString = "?"
        } else {
            newQueryString += "&"
        }
        newQueryString += parameterName + "=" + parameterValue
    }
    return urlParts[0] + newQueryString;
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
  return ua.indexOf("android") > -1
}

$(function () {
    recordUserPage(openid, $('title').html(), "");
    var $copyright = $('.copyright'), cbUrl = window.location.href;
    if($copyright) $copyright.html(copyright);
    if(cbUrl.indexOf('cb41faa22e731e9b') < 0 ){
        $('#div_subscribe_area').css('height', '0');
        $('body').removeClass('subscribe');
    } else {
        $('#div_subscribe_area').css('height', '50px');
        $('body').addClass('subscribe');
    }
    $("script").each(function(i, item) {
        var scr = $(this).attr("src");
        $(this).attr("src", scr + "?v=" + version);
    });
    $.ajax({
        type : "get",
        async : false,
        url : domain_url + "api/common/versioncheck" + dev,
        dataType : "jsonp",
        jsonp : "callback",
        jsonpCallback : "commonApiVersionHandler",
        success : function(data) {
            if (!data.result){
                location.href = data.redirect;
            }
            share_img = data.si;
            share_title = data.st;
            share_desc = data.sd;
            share_group = data.sgt;
            window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, getUrl(openid));
            var typeofAppid = typeof(follow_shaketv_appid);
            if (typeofAppid == 'undefined' || typeofAppid == '' || typeofAppid == null) {
                return;
            } else {
                if(openid){
                    window['shaketv'] && shaketv.subscribe({
                        appid: follow_shaketv_appid,
                        selector: "#div_subscribe_area",
                        type: 1
                    }, function (returnData) {
                        $('body').removeClass('subscribe');
                    });
                };
            };
            // new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
        },
        error : function() {
            // new Authorize({callBackPage:"index.html"}).init(check_weixin_login());
        }
    });

    // 从data_collect.js里转移过来的

    $('body').delegate("*[data-collect='true']", "click", function(e) {
        e.preventDefault();

        if ($(this).attr('data-stoppropagation') == 'true') {
            e.stopPropagation();
        }
        recordUserOperate(openid, $(this).attr("data-collect-desc"), $(this).attr("data-collect-flag"));
        var href = $(this).attr('href');
        if (href && href !== '#') {
            setTimeout(function() {
                window.location.href = href;
            }, 10);
        }
    });
});
