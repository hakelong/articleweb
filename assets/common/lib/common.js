/**
 * Created by qxf on 2017/12/29.
 */
var Commonfns = {
    /*
     * 打开pre调试后台
     * 
     */
    openPreConsole:function(){
        if(window.location.href.indexOf("pre")>-1 || window.location.href.indexOf("http:")>-1){
            this.loadScript("https://respaypre.suning.com/epwm/scripts/loginsms/lib/eruda.min.js",function() {
                eruda.init();
            });
        }

    },
    // 加载外部js
    loadScript: function(url, callback) {
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
    getDeviceInfo:function(){
        var opts={};
        var u = navigator.userAgent;
        opts.isAndroid =  u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        opts.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        opts.isSNYfb=/snyifubao/i.test(u.toLocaleLowerCase());
        opts.isPlugin = u.indexOf('EBuy-SNYifubao') > -1 || navigator.userAgent.indexOf('SNYifubaoPlugin') > -1;
        opts.isEbuy = /ebuy/i.test(u.toLocaleLowerCase()) && !opts.isPlugin;
        opts.SNYfbVersion=u.substr(u.indexOf('SNYifubao') + 10, 6);
        opts.isWeChat = u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
        opts.isWeibo = u.toLowerCase().indexOf('weibo') > -1;
        return opts;
    },
    /*
   * 更新页面标题 author:Qianxuefeng
   */
  updateTitle: function (title) {
    var deviceInfo = window.Common.getDeviceInfo();
    if (deviceInfo.isSNYfb && deviceInfo.isiOS) { //
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
    } else {
      document.title = title;
    }
  },
    /*
    * app版本号比较
    * 调用方法举例：compare("1.1","1.2")，将返回false
    */
     compareVersion: function(curV,reqV){
        if(curV && reqV){
        //将两个版本号拆成数字
        var arr1 = curV.split('.'),
            arr2 = reqV.split('.');
        var minLength=Math.min(arr1.length,arr2.length),
            position=0,
            diff=0;
        //依次比较版本号每一位大小，当对比得出结果后跳出循环
        while(position<minLength && ((diff=parseInt(arr1[position])-parseInt(arr2[position]))==0)){
            position++;
        }
        diff=(diff!=0)?diff:(arr1.length-arr2.length);
        //若curV大于reqV，则返回true
        return diff>0;
        }else{
        //输入为空
        console.log("版本号不能为空");
        return true;
        }
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
     /*
   * 初始化金融APP客户端对象
   */
    loadYFBNative:function(callback){
      var deviceInfo =Commonfns.getDeviceInfo();
      if (deviceInfo.isSNYfb) {
        Commonfns.loadScript(DEVCONFIG.snJrClient,
          function () {
  callback?callback():"";
          }
        );
      }
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
  getPcToken2: function(code){
    Commonfns.loadScript(DEVCONFIG.pctoken2Server+'/dfprs-collect/dist/fp.js', function () {
      _dfp.init({
        appCode: code, // 必填
        env: DEVCONFIG.envCode,     // 必填
        success: function (token) {
          if (token == undefined) {
            window.pcToken2 = "";
          } else {
            window.pcToken2 = token;
          }
        },
        error: function (e) {
          console.log(e);
        }
      });
    })
  }
};

export const Common= Commonfns;
import Vue from 'vue'

export const bus= new Vue;

/*pull start*/
var pulldown = {};
!(function(pulldown) {
    let isLoading = false,
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


    function touchstart(e, self) {
        var touches = e.touches[0];
        pullPos.start.x = touches.clientX;
        pullPos.start.y = touches.clientY;
    }

    function touchmove(e, self) {
        var touches = e.touches[0];
        pullPos.move.x = touches.clientX;
        pullPos.move.y = touches.clientY;
        self.handler(e);

    }

    function touchend(e, self) {


    }

    function countAngle(start, end) {
        let diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    }
    var pulldownEvent = {
        inserted: function(el, binding) {
            el.pulldownObj = {};
            el.handler = function(e) {
                var value = binding.value,value1 = binding.value,
                    args = [];
                if (typeof value == 'object') {
                    args = value.pullConfig;
                    value = value.arriveBottomEvent;
                    value1 = value1.arriveTopEvent;
                    var outSightHeight = document.body.getBoundingClientRect().top,
                        inSightHeight = window.innerHeight,
                        realHeight = document.body.getBoundingClientRect().height;
                    if (Math.abs(outSightHeight + realHeight - inSightHeight) < args.preOffset + 2 && isLoading == false && (90 - Math.abs(countAngle(pullPos.start, pullPos.move))) < 10) {
                        isLoading = true;
                        value(function() {
                            isLoading = false;
                            console.log("上拉记载结束")
                        });

                    }
                  if(pullPos.move.y>pullPos.start.y && document.body.getBoundingClientRect().top==0){


                   if(value1){
                    isLoading = true;
                    value1(function() {
                      isLoading = false;
                      console.log("下拉刷新结束")

                    });
                   }

                  }

                }

            };

            el.addEventListener('touchstart', function(e) {
                touchstart(e, el);
            }, false);

            el.addEventListener('touchmove', function(e) {
                return touchmove(e, el);
            }, false)
            el.addEventListener('touchcancel', function(e) {
                return touchend(e, el);
            }, false);
            el.addEventListener('touchend', function(e) {

                return touchend(e, el);
            }, false);
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
/*pull end*/


export const pull=pulldown


var tap = {};
!(function(tap){

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
        var value = binding.value,args = [];
        if(typeof value == 'object'){
            args = value.args;
            value = value.fn;
        }
        if (!value && el.href && !binding.modifiers.prevent) {
          return window.location = el.href;
        }

        if(value){
          if(!args) args = [];
          args.unshift(e);
          var tagName = e.target.tagName.toLocaleLowerCase();

          if(tagName === 'input' || tagName === 'textarea') {
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

        if (binding.modifiers.stopClick){
          if(!el.lastClick||el.lastClick+1000<= +new Date()) el.lastClick = +new Date();
          else return false
        }

        // e.preventDefault();
        return touchend(e, el);

      }, false);
    },
    // update: function (el, binding, vnode, oldVnode) {
    //   if(oldVnode.data.ref === vnode.data.ref) return;
    //   el.tapObj = {};
    //   el.handler = function (e) {
    //     var value = binding.value,args = [];
    //     if(typeof value == 'object'){
    //       args = value.args;
    //       value = value.fn;
    //     }
    //     if (!value && el.href && !binding.modifiers.prevent) {
    //       return window.location = el.href;
    //     }
    //
    //     if(value){
    //       if(!args) args = [];
    //       args.unshift(e);
    //       var tagName = e.target.tagName.toLocaleLowerCase();
    //
    //       if(tagName === 'input' || tagName === 'textarea') {
    //         return e.target.focus();
    //       }
    //       value.call(this, args);
    //       args.shift(e);
    //     }
    //   };
    //
    //   el.addEventListener('touchstart', function (e) {
    //     if (binding.modifiers.stop)
    //       e.stopPropagation();
    //     if (binding.modifiers.prevent)
    //       e.preventDefault();
    //     touchstart(e, el);
    //   }, false);
    //
    //   el.addEventListener('touchend', function (e) {
    //     Object.defineProperty(e, 'currentTarget', {
    //       value: el,
    //       writable: true,
    //       enumerable: true,
    //       configurable: true
    //     });
    //
    //     if (binding.modifiers.stopClick){
    //       if(!el.lastClick||el.lastClick+1000<= +new Date()) el.lastClick = +new Date();
    //       else return false
    //     }
    //
    //     // e.preventDefault();
    //     return touchend(e, el);
    //
    //   }, false);
    // },
    unbind: function (el) {
      el.handler = function () {};
    }
  };

  tap.install = function (Vue) {
    Vue.directive('tap', tapEvent);
  };

  tap.version = '1.0.1';
})(tap)

export const Vtap= tap





/**
 * h5 缓存 localStorage
*/
export const store = {
  getItem(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (err) {
      return null
    }
  },
  setItem(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
  },
  clear() {
    window.localStorage.clear();
  },
  keys() {
    return window.localStorage.keys();
  },
  removeItem(key) {
    window.localStorage.removeItem(key);
  }
}

/**
 * h5 缓存 sessionStorage
*/
export const sessionStore = {
  getItem(key) {
    try {
      return JSON.parse(window.sessionStorage.getItem(key));
    } catch (err) {
      return null
    }
  },
  setItem(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val));
  },
  clear() {
    window.sessionStorage.clear();
  },
  keys() {
    return window.sessionStorage.keys();
  },
  removeItem(key) {
    window.sessionStorage.removeItem(key);
  }
}

/**
 * 时间操作集
 */
export const MDate = {
  // 获取时间差
  getTimeDifference(startTime,endTime) {
    startTime = new Date(Date.parse(startTime.replace(/-/g, "/")));
    endTime = new Date(Date.parse(endTime.replace(/-/g, "/")));
    var timeDiffer = endTime.getTime() -startTime.getTime();
    var dayBase = 1000*3600*24,
        hourBase = 1000*3600,
        minuteBase = 1000*60,
        secondBase = 1000;
    var day = Math.floor(timeDiffer/dayBase);
    var hour = Math.floor((timeDiffer - day*dayBase)/hourBase);
    var minute = Math.floor((timeDiffer - day*dayBase-hour*hourBase)/minuteBase);
    var second = Math.floor((timeDiffer - day*dayBase-hour*hourBase-minute*minuteBase)/secondBase)

    return {
      second:second,
      minute:minute,
      hour:hour,
      day:day
    }
  },
  addDate(sysDate,option) {
      option.year = option.year || 0;
      option.month = option.month || 0;
      option.day = option.day || 0;
      option.hour = option.hour || 0;
      option.minute = option.minute || 0;
      option.second = option.second || 0;
      // option = {
      //   year:0,
      //   month:0,
      //   day:0,
      //   hour:0,
      //   minute:0,
      //   second:0
      // }
      // days = !days ? 0 : days;
      let date = typeof sysDate === 'string' ? new Date(Date.parse(sysDate.replace(/-/g, "/"))) : new Date();
      date.setFullYear(date.getFullYear() + option.year);
      date.setMonth(date.getMonth() + option.month);
      date.setDate(date.getDate() + option.day);
      date.setHours(date.getHours() + option.hour);
      date.setMinutes(date.getMinutes() + option.minute);
      date.setSeconds(date.getSeconds() + option.second);
      return date;
  },
}

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

//拖动事件绑定
let isDragging = false;

export const draggable = function(el, options) {
  const moveFn = function(event) {
    if (options.drag) {
      options.drag(event.changedTouches[0] || event.touches[0]);
    }
  };

  const endFn = function(event) {
    isDragging = false;
    if (options.end) {
      options.end(event.changedTouches[0] || event.touches[0]);
    }
  };

  el.addEventListener('touchstart', function(event) {
    if (isDragging) return;
    isDragging = true;
    if (options.start) {
      // event.preventDefault();
      options.start(event.changedTouches[0] || event.touches[0]);
    }
  });

  el.addEventListener('touchmove', moveFn);
  el.addEventListener('touchend', endFn);
  el.addEventListener('touchcancel', endFn);
};

//代理vue实例的$emit
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child[eventName]&&child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat(params));
    }
  });
}
export const emitter =  {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent[eventName]&&parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
