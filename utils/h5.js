export default {
  buryingName: function (el) {
    try {
      window.sa.click.sendDatasIndex(el)
    } catch (error) {
      console.log(error)
    }
  },
  getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
      var aCrumb = aCookie[i].split("=");
      if (sName == aCrumb[0])
        return unescape(aCrumb[1]);
    }
    return null;
  },
  setCookie(name, value, expires, domain, path, secure) {
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
}
