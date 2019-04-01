/**
 * Created by qxf on 2017/12/29.
 */
var Commonfns = {
  initSNNative: function (callback) {
    var deviceInfo = Common.getDeviceInfo();
    if (deviceInfo.isSNYfb) {
      Common.loadScript(DEVCONFIG.snJrClient, function () {
        callback();
      });
    }
    if (deviceInfo.isEbuy && !deviceInfo.isSNYfb) {
      if (deviceInfo.isAndroid) {
        Common.loadScript(DEVCONFIG.ebuyClient, function () {
          document.addEventListener("deviceready", function () {
            callback();
          }, false);
        });
      } else {
        document.addEventListener("SNNativeClientReady", function () {
          callback();
        }, false);
      }

    }
  },
  /*
   * 打开pre调试后台
   * 
   */
  openPreConsole: function () {
    if (window.location.href.indexOf("pre") > -1 || window.location.href.indexOf("10.19.38.49") > -1) {
      this.loadScript("https://respaypre.suning.com/epwm/scripts/loginsms/lib/eruda.min.js", function () {
        eruda.init();
      });
    }

  },
  checkLoginStatus: function(loginCallback,targetUrl) {
    this.JsonpAjax({
      url: passportParam.domainUrl + "/authStatus", // 请求地址
      jsonp: 'jsonpCallback', // 采用jsonp请求，且回调函数名为"jsonpCallbak"，可以设置为合法的字符串
      data: {}, // 传输数据
      success: function(res) { // 请求成功的回调函数
        if (res.hasLogin) {
          loginCallback();
        } else {
          var url = passportParam.passportUrl + "/ids/login?service=" + encodeURIComponent(passportParam.domainUrl + "/auth?targetUrl=" + targetUrl) + "&loginTheme=" + passport_config.loginTheme;
          window.location.href = url;
        }

      },

      error: function(error) {} // 请求失败的回调函数

    });
  },
  JsonpAjax: function(params) {

    params = params || {};

    params.data = params.data || {};

    var json = params.jsonp ? jsonp(params) : json(params);



    // jsonp请求

    function jsonp(params) {

      //创建script标签并加入到页面中

      var callbackName = params.jsonp;

      var head = document.getElementsByTagName('head')[0];

      // 设置传递给后台的回调参数名

      params.data['callback'] = callbackName;

      var data = formatParams(params.data);

      var script = document.createElement('script');

      head.appendChild(script);



      //创建jsonp回调函数

      window[callbackName] = function(json) {

        head.removeChild(script);

        clearTimeout(script.timer);

        window[callbackName] = null;

        params.success && params.success(json);

      };



      //发送请求

      script.src = params.url + '?' + data;



      //为了得知此次请求是否成功，设置超时处理

      if (params.time) {

        script.timer = setTimeout(function() {

          window[callbackName] = null;

          head.removeChild(script);

          params.error && params.error({

            message: '超时'

          });

        }, time);

      }

    };



    //格式化参数

    function formatParams(data) {

      var arr = [];

      for (var name in data) {

        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));

      };



      // 添加一个随机数，防止缓存

      arr.push('v=' + random());

      return arr.join('&');

    }



    // 获取随机数

    function random() {

      return Math.floor(Math.random() * 10000 + 500);

    }
  },
  // 加载外部js
  loadScript: function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof (callback) != "undefined") {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function () {
          callback();
        };
      }
    }
    script.src = url;
    document.body.appendChild(script);
  },
  getDeviceInfo: function () {
    var opts = {};
    var u = navigator.userAgent;
    opts.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    opts.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    opts.isSNYfb = /snyifubao/i.test(u.toLocaleLowerCase());
    opts.isEbuy = /ebuy/i.test(u.toLocaleLowerCase());
    opts.isPlugin = u.indexOf('EBuy-SNYifubao') > -1 || navigator.userAgent.indexOf('SNYifubaoPlugin') > -1;
    opts.SNYfbVersion = u.substr(u.indexOf('SNYifubao') + 10, 6);
    opts.isWeChat = u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
    opts.isWeibo = u.toLowerCase().indexOf('weibo') > -1;
    if (opts.isSNYfb) {
      if (opts.isAndroid) {
        opts.terminal = '13'
      } else {
        opts.terminal = '12'
      }
    } else {
      opts.terminal = '14';
    }
    return opts;
  },
  /*
   * app版本号比较  author:Qianxuefeng
   * 调用方法举例：compare("1.1","1.2")，将返回false
   */
  compareVersion: function (curV, reqV) {
    if (curV && reqV) {
      //将两个版本号拆成数字
      var arr1 = curV.split('.'),
        arr2 = reqV.split('.');
      var minLength = Math.min(arr1.length, arr2.length),
        position = 0,
        diff = 0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环
      while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
        position++;
      }
      diff = (diff != 0) ? diff : (arr1.length - arr2.length);
      //若curV大于reqV，则返回true
      return diff > 0;
    } else {
      //输入为空
      //console.log("版本号不能为空");
      return true;
    }
  },
  buryPoint: function (id) {
    try {
      sa.click.sendDatasIndex(document.getElementById(id));
    } catch (e) {}
  },
  /*
   * 更新页面标题 author:Qianxuefeng
   */
  updateTitle: function (title) {
    var deviceInfo = window.Common.getDeviceInfo();
    if (deviceInfo.isSNYfb && deviceInfo.isiOS) { // 金融app ios端需调用sdkjs方法更新title
      //callBillDetail 可换成其他6.5.17版本以上的sdk接口名，测试消费贷时发现客户端存在一个bug，客户端webview加载页面时会自带SNNativeClient对象但不包含近期版本新加的接口
      //该bug造成页面不会加载 snjr.js从而导致调用接口没反应
      if (!(window.SNNativeClient && window.SNNativeClient.callBillDetail)) {
        window.Common.loadScript(
          "https://respay.suning.com/eppClientApp/html/js/Jsnjr.js",
          function () {
            SNNativeClient.updateTitle(title);
          }
        );
      } else {
        SNNativeClient.updateTitle(title);
      }
    } else if (deviceInfo.isEbuy) {
      // alert('ebuy')
      // alert(window.Common.getDeviceInfo)
      if(deviceInfo.isiOS){
        // alert('ios')
        if (window.SNNativeClient) {
          // alert('调用updatetitle')
          window.SNNativeClient.updateTitle(title)
        }else{
          // alert('注册ready事件')
          document.addEventListener('SNNativeClientReady', function(){
            setTimeout(() => {
              // alert('调用updatetitle')
              window.SNNativeClient.updateTitle(title)
            }, 300);
            
          }, false)
        }
      }
      if(deviceInfo.isAndroid){
        document.title = title;
      }
    } else {
      document.title = title;
    }
  },
  /*
   * app内展示右上角菜单
   */
  showRightButtonMenu: function (opt) {
    let jsonString = JSON.stringify(opt || [{}]);
    if (!(window.SNNativeClient && window.SNNativeClient.callBillDetail)) {
      window.Common.loadScript(
        "https://respay.suning.com/eppClientApp/html/js/Jsnjr.js",
        function () {
          SNNativeClient.showRightButtonMenu(jsonString);
        }
      );
    } else {
      SNNativeClient.showRightButtonMenu(jsonString);
    }
  },
  /*
   * app内调用客户端分享
   */
  callNativeShare3: function (opt) {
    let json = opt || {};
    if (!(window.SNNativeClient && window.SNNativeClient.callBillDetail)) {
      window.Common.loadScript(
        "https://respay.suning.com/eppClientApp/html/js/Jsnjr.js",
        function () {
          SNNativeClient.callNativeShare3(json);
        }
      );
    } else {
      SNNativeClient.callNativeShare3(json);
    }
  },
  getRiskToken: function (opt) {
    let json = opt || {};
    if (!(window.SNNativeClient && window.SNNativeClient.callBillDetail)) {
      window.Common.loadScript(
        "https://respay.suning.com/eppClientApp/html/js/Jsnjr.js",
        function () {
          SNNativeClient.getRiskToken(json);
        }
      );
    } else {
      SNNativeClient.getRiskToken(json);
    }
  },
  /*
   * app内调用客户端分享,
   * 金融客户端获取设备id请用此方法
   */
  getFullDeviceInfo: function (opt) {
    if (!(window.SNNativeClient && window.SNNativeClient.callBillDetail)) {
      window.Common.loadScript(
        "https://respay.suning.com/eppClientApp/html/js/Jsnjr.js",
        function () {
          SNNativeClient.getFullDeviceInfo(opt || {});
        }
      );
    } else {
      SNNativeClient.getFullDeviceInfo(opt || {});
    }
  },
  handleTime: function (time) {
    // 处理时间 返回objecr
    // 2017-09-21 12:00:00
    var dt = {};
    dt.year = time.substr(0, 4) || '';
    dt.month = time.substr(5, 2) || '';
    dt.day = time.substr(8, 2) || '';
    dt.fullTime = time.substr(-8) || '';
    dt.fullDate = time.substr(0, 10) || '';
    dt.fullMonth = time.substr(0, 7) || '';
    dt.fullDay = time.substr(5, 5) || '';
    dt.formattedTime = dt.fullTime.substr(0, 5) || '';
    return dt;
  },
  // 比较时间1>时间2 返回bool
  compareTime: function (firsttime, secondtime) {
    return ((new Date(firsttime.replace(/-/g, "\/"))) > (new Date(secondtime.replace(/-/g, "\/"))));
  },
  /*
   * 获取pctoken/pctoken2,页面上需提前引入conffig.js配置环境变量
   */
  getPcToken: function () {
    Commonfns.loadScript(DEVCONFIG.fpToken+"/bennu-collector/fp/porto.js", function () {
      porto.init({
        partnerCode: 'none',
        appName: 'commerce',
        referenceId: '123',
        sessionId: '123',
        serviceUrl: DEVCONFIG.fpToken+"/bennu-collector/fp/porto.json"
      });
      function getCookie(sName) {
        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
          var aCrumb = aCookie[i].split("=");
          if (sName == aCrumb[0])
            return unescape(aCrumb[1]);
        }
        return null;
      }
      window.pcToken = getCookie('_device_session_id');
    })
  },
  getPcToken2: function(code,callback){
    Commonfns.loadScript(DEVCONFIG.pctoken2Server+'/dfprs-collect/dist/fp.js', function () {
      _dfp.init({
        appCode: code, // 必填
        env: DEVCONFIG.envCode,     // 必填
        success: function (token) {
          console.log(token)
          if (token == undefined) {
            window.pcToken2 = "";
          } else {
            window.pcToken2 = token;
          }
          callback()
        },
        error: function (e) {
          console.log(e);
        }
      });
    })
  },
  getQueryString: function (val) {
    var reg = new RegExp("(^|&)" + val + "=([^&]*)(&|$)", "i");
    var hash = window.location.hash
    if (hash.indexOf("?") > -1) {
      var index = hash.indexOf("?")
      var r = hash.substr(index + 1).match(reg);
    } else {
      var searchStr = window.location.search
      var r = searchStr.substr(1).match(reg);
    }
    if (r != null) return unescape(r[2]);
    return null;
  }
};

export const Common = Commonfns;
export const CookieUtil = {
  // 设置cookie
  set : function (name, value, expires, domain, path, secure) {
      var cookieText = "";
      cookieText += encodeURIComponent(name) + "=" + encodeURIComponent(value);
      if (expires instanceof Date) {
          cookieText += ";expires=" + expires.toGMTString();
      }
      if (path) {
          cookieText += ";path=" + path;
      }
      if (domain) {
          cookieText += ";domain=" + domain;
      }
      if (secure) {
          cookieText += ";secure";
      }
      document.cookie = cookieText;
  },
  // name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure
  // 获取cookie
  get : function (name) {
      var cookieName = encodeURIComponent(name) + "=",
          cookieStart = document.cookie.indexOf(cookieName),
          cookieValue = "";
      if (cookieStart > -1) {
          var cookieEnd = document.cookie.indexOf (";", cookieStart);
          if (cookieEnd == -1) {
              cookieEnd = document.cookie.length;
          }
          cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
      }
      return cookieValue;
  },
  // 删除cookie
  unset : function (name, domain, path, secure) {
      this.set(name, "", Date(0), domain, path, secure);
  }
};
import Vue from 'vue'

export const bus = new Vue;

/*pull start*/
var pulldown = {};
!(function(pulldown) {
  let isTopLoading = false,isBottomLoading = false,isPullDownMoving=false,isPullUpMoving=false,
    pullPos = {
      start: {
        x: 0,
        y: 0
      },
      move: {
        x: 0,
        y: 0
      }
    };




  function countAngle(start, end) {
    let diff_x = end.x - start.x,
      diff_y = end.y - start.y;
    return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
  }
  var pulldownEvent = {
    inserted: function(el, binding) {
      el.pulldownObj = {};


      el.addEventListener('touchstart', function(e) {
        var touches = e.touches[0];
        pullPos.start.x = touches.clientX;
        pullPos.start.y = touches.clientY;
      });

      el.addEventListener('touchmove', function(e) {
        var self=el;
        var touches = e.touches[0];
        pullPos.move.x = touches.clientX;
        pullPos.move.y = touches.clientY;

        var ang=90-Math.abs(countAngle(pullPos.start,pullPos.move));
        if(pullPos.move.y>pullPos.start.y && (self.scrollTop||window.pageYOffset)==0 && ang<10){
          e.preventDefault();
          binding.value.startPullDownEvents();
          isPullDownMoving=true;
          self.style.setProperty("transition-duration", "0ms");
          self.style.setProperty("-moz-transition-duration", "0ms");
          self.style.setProperty("-webkit-transition-duration", "0ms");
          self.style.setProperty("-o-transition-duration", "0ms");
          self.style.setProperty("transform", "translateY(" + (pullPos.move.y - pullPos.start.y) / 3 + "px)");
          self.style.setProperty("-ms-transform", "translateY(" + (pullPos.move.y - pullPos.start.y) / 3 + "px)");
          self.style.setProperty("-moz-transform", "translateY(" + (pullPos.move.y - pullPos.start.y) / 3 + "px)");
          self.style.setProperty("-webkit-transform", "translateY(" + (pullPos.move.y - pullPos.start.y) / 3 + "px)");
          self.style.setProperty("-o-transform", "translateY(" + (pullPos.move.y - pullPos.start.y) / 3 + "px)");
        }
        var outSightHeight = el.getBoundingClientRect().top,
          inSightHeight = window.innerHeight,
          realHeight = el.getBoundingClientRect().height;

        if(pullPos.move.y<pullPos.start.y &&(Math.abs(outSightHeight + realHeight - inSightHeight) < binding.value.pullConfig.preOffset + 2) && !isBottomLoading && ang<10){
          isPullUpMoving = true;
        }

      }, false);
      el.addEventListener('touchcancel', function(e) {
        releaseCallback(el);
      });
      el.addEventListener('touchend', function(e) {
        releaseCallback(el);

      });
      function releaseCallback(self){
        if(isPullDownMoving){
          self.style.setProperty("transition-duration", "500ms");
          self.style.setProperty("-moz-transition-duration", "500ms");
          self.style.setProperty("-webkit-transition-duration", "500ms");
          self.style.setProperty("-o-transition-duration", "500ms");

          self.style.setProperty("transform", "translateY(50px)");
          self.style.setProperty("-ms-transform", "translateY(50px)");
          self.style.setProperty("-moz-transform", "translateY(50px)");
          self.style.setProperty("-webkit-transform", "translateY(50px)");
          self.style.setProperty("-o-transform", "translateY(50px)");
        }
        if(isPullDownMoving && !isTopLoading){

          if(binding.value.arriveTopEvent){
            isTopLoading = true;
            binding.value.arriveTopEvent(function() {
              isTopLoading = false;
              isPullDownMoving=false;
              self.style.setProperty("transition-duration", "500ms");
              self.style.setProperty("-moz-transition-duration", "500ms");
              self.style.setProperty("-webkit-transition-duration", "500ms");
              self.style.setProperty("-o-transition-duration", "500ms");

              self.style.setProperty("transform", "translateY(0)");
              self.style.setProperty("-ms-transform", "translateY(0)");
              self.style.setProperty("-moz-transform", "translateY(0)");
              self.style.setProperty("-webkit-transform", "translateY(0)");
              self.style.setProperty("-o-transform", "translateY(0)");
              console.log("下拉刷新结束")

            });
          }

        }

        if(isPullUpMoving && !isBottomLoading){

          if(binding.value.arriveBottomEvent){
            isBottomLoading=true;
            binding.value.arriveBottomEvent(function() {
              isBottomLoading = false;
              isPullUpMoving = false;
              console.log("上拉加载结束")
            });
          }
        }
      }
    },
    unbind: function(el) {
      el.handler = function() {};
    }
  };

  pulldown.install = function(Vue) {
    Vue.directive('pulldown', pulldownEvent);
  };

  pulldown.version = '1.0.1';
})(pulldown);
export const pull=pulldown
/*pull end*/


var tap = {};
!(function (tap) {

  function isTap(self) {
    if (self.disabled) {
      return false;
    }
    var tapObj = self.tapObj;
    return self.time < 300 && Math.abs(tapObj.distanceX) < 10 && Math.abs(tapObj.distanceY) < 10;
  }

  function touchstart(e, self) {
    var touches = e.touches[0];
    var tapObj = self.tapObj;
    tapObj.pageX = touches.pageX;
    tapObj.pageY = touches.pageY;
    tapObj.clientX = touches.clientX;
    tapObj.clientY = touches.clientY;
    self.time = +new Date();
  }

  function touchend(e, self) {
    var touches = e.changedTouches[0];
    var tapObj = self.tapObj;
    self.time = +new Date() - self.time;
    tapObj.distanceX = tapObj.pageX - touches.pageX;
    tapObj.distanceY = tapObj.pageY - touches.pageY;

    if (!isTap(self)) return;
    self.handler(e);

  }

  var tapEvent = {
    inserted: function (el, binding) {
      el.tapObj = {};
      el.handler = function (e) {
        var value = binding.value,
          args = [];
        if (typeof value == 'object') {
          args = value.args;
          value = value.fn;
        }
        if (!value && el.href && !binding.modifiers.prevent) {
          return window.location = el.href;
        }

        if (value) {
          if (!args) args = [];
          args.unshift(e);
          var tagName = e.target.tagName.toLocaleLowerCase();

          if (tagName === 'input' || tagName === 'textarea') {
            return e.target.focus();
          }
          value.call(this, args);
          args.shift(e);
        }
      };

      el.addEventListener('touchstart', function (e) {
        if (binding.modifiers.stop)
          e.stopPropagation();
        if (binding.modifiers.prevent)
          e.preventDefault();
        touchstart(e, el);
      }, false);

      el.addEventListener('touchend', function (e) {
        Object.defineProperty(e, 'currentTarget', {
          value: el,
          writable: true,
          enumerable: true,
          configurable: true
        });
        if (binding.modifiers.stopClick) {
          if (!el.lastClick || el.lastClick + 1000 <= +new Date()) el.lastClick = +new Date();
          else return false
        }
        // e.preventDefault();
        return touchend(e, el);

      }, false);
    },
    unbind: function (el) {
      el.handler = function () {};
    }
  };

  tap.install = function (Vue) {
    Vue.directive('tap', tapEvent);
  };

  tap.version = '1.0.1';
})(tap)


export const Vtap = tap


var moneyFormatter = function (value) {
  if (!value) return '0.00';
  var intPart = Number(value.split('.')[0]).toFixed(0); //获取整数部分

  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

  var floatPart = ".00"; //预定义小数部分
  var value2Array = value.split(".");

  //=2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分

    if (floatPart.length == 1) { //补0
      return intPartFormat + "." + floatPart + '0';
    } else {
      return intPartFormat + "." + floatPart;
    }

  } else {
    return intPartFormat + floatPart;
  }

}
export const vMoneyFormatter = moneyFormatter;

var fixTowFormatter = function (value) {
  if (!value) return '0.00';
  return Number(value).toFixed(2);
}

export const vFixTwoFormatter = fixTowFormatter;

const vFocus = Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
});
export {
  vFocus
};
