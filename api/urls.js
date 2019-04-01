export default {
    showHeaderUrl:"http://mkserver.cnsuning.com/umss/mock/epwm/getConfigInfo/realAuthConfigInfo.htm",
    loadCardNoUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/loadCardNo.htm',
    addBankCardUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/addBankCard.htm',
    toModify:'www.baidu.com',//不是本人链接
    loadCardInfoUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/loadCardInfo.htm',
    sendQuickSignAndValidateBankInfoUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/sendQuickSignAndValidateBankInfo.htm',
    refreshPhoneCodeFtlUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/refreshPhoneCodeFtl.htm',
    submitQuickSignUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/submitQuickSign.htm',
    setSimplePaymentPasswordUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/realAuthBindCard/setSimplePaymentPassword.htm',
    queryBankSignCardsUrl:'',
    submitSimplePasswordUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/saveIdentityPhoto/submitSimplePassword.htm',
    submitIdentityPhotoUrl:'http://mkserver.cnsuning.com/umss/mock/epwm/saveIdentityPhoto/submitIdentityPhoto.htm',
}
export const hrefUrls={
    successPageUrl:' https://mpaypre.cnsuning.com/epwm/identity/identityVerification.htm',
    toAgreementUrl:"https://mpaypre.cnsuning.com/epwm/regist/doShowTheAgreement.htm",//协议链接
    uploadCheckUrl:'/epwm/identity/identityPhotoChecking.htm'
}
export const showHeaderUrl="http://mkserver.cnsuning.com/umss/mock/epwm/getConfigInfo/realAuthConfigInfo.htm";
export const DEVCONFIG= {
    //金融App客户端js
    "snJrClient": "https://respaypre.suning.com/eppClientApp/html/js/Jsnjr.js",
    //易购App客户端js
    "ebuyClient": "https://res.mpre.cnsuning.com/common/script/android/sneapp.js",
    //静态资源服务器
    "picServer": "https://respaypre.suning.com",
    //风控
    "fpToken": "https://fppre.cnsuning.com",
    //下载导航
    "downBar": "https://respaypre.suning.com/eppClientApp/html/js/downappNew.js",
    // 验证码服务器
    "validateCodeServer": "https://vcspre.cnsuning.com",
    // sfli地址
    "sfliOrigin": "http://sflipre.cnsuning.com",
    // fmps地址
    "fmpsOrigin": "https://fmpspre.cnsuning.com",
    // cms图片地址,
    "cmsPicServer": "https://uimgpre.cnsuning.com",
    //epwm地址
    "epwmServer": "https://mpaypre.cnsuning.com",
    // 人机识别js
    "detectServer": "https://dtpre.cnsuning.com/detect/dt/detect.js",
    //pctoken2服务器域名
    "pctoken2Server": "https://dfppre.cnsuning.com",
    "dfpToken": "https://dfppre.cnsuning.com/dfprs-collect/dist/fp.js",
    //env
    "envCode": "pre",
    //页头隐藏环境适配
    'hideHeader':['android']
  }