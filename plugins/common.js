import utils from '~/utils/h5.js'
function appInfo() {
  var browser = {
      msie: false,
      firefox: false,
      opera: false,
      safari: false,
      chrome: false,
      netscape: false,
      appname: 'unknown',
      version: 0
    },
    userAgent = window.navigator.userAgent.toLowerCase();
  if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/i.test(userAgent)) {
    browser[RegExp.$1] = true;
    browser.appname = RegExp.$1;
    browser.version = RegExp.$2;
  } else if (/version\D+(\d[\d.]*).*safari/i.test(userAgent)) { // safari
    browser.safari = true;
    browser.appname = 'safari';
    browser.version = RegExp.$1;
  }
  return browser;
}
window.browserInfo = appInfo();

utils.setCookie({
  name: 'browserName',
  value: browserInfo.appname,
  path: '/'
});
utils.setCookie({
  name: 'browserVersion',
  value: browserInfo.version,
  path: '/'
});

window.appConfig = {
    quality: 0.6,
    scale: 0.7,
  }
