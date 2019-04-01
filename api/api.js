import axios from 'axios'
import urls from '~/api/urls'
let getJson = (url, params, config) => {
  return new Promise(function (resolve, reject) {
    axios.get(url, params).then(res => {
      res.status == 200 ? resolve(res) : reject('错误aa:', res.status)
    }).catch(err => {
      reject(err)
    })
  })
}
let postJson=(url,params,config)=>{
  return new Promise((resolve,reject)=>{
    axios.post(url,params,{
      validateStatus(status){
        return status==200
      }
    }).then(res=>{
      resolve(res)
    }).catch(err=>{
      console.log('shibai')
      reject(err)
    })
  })
}
export default class {
    /* 判断是否隐藏头 */
    static hideHeader(){
        return postJson(urls.showHeaderUrl)
    }
    static initBankNum(){
        return postJson(urls.loadCardNoUrl)
    }
    static go(params){
      return postJson(urls.addBankCardUrl,params)
    }
    static initBankInfo(params){
      return postJson(urls.loadCardInfoUrl,params)
    }
    /* 四要素页面提交信息 */
    static sendQuickSignAndValidateBankInfo(params){
      return postJson(urls.sendQuickSignAndValidateBankInfoUrl,params)
    }
    static getPhoneNumber(){
      return postJson(urls.refreshPhoneCodeFtlUrl)
    }
    static submitQuickSign(params){
      return postJson(urls.submitQuickSignUrl,params)
    }
    /* 重发验证码 */
    static reSend(){
      return postJson(urls.sendQuickSignAndValidateBankInfoUrl)
    }
    /* 设置密码页提交密码 */
    static submit(params){
      return postJson(urls.setSimplePaymentPasswordUrl,params)
    }
    static getListData(params){
      return postJson(urls.queryBankSignCardsUrl,params)
    }
    /* photoPwd */
    static submitSimplePassword(params){
      return postJson(urls.submitSimplePasswordUrl,params)
    }
    static submitIdentityPhoto(params){
      return postJson(urls.submitIdentityPhotoUrl,params)
    }
}