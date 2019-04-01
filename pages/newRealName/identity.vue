<template>
<div class='index'>
  <topBar style='background-color:#fff'>银行卡信息</topBar>
  <div id='identityMaidian' name='wap_authentication_secondtstep' display='none'></div>
  <!-- <div class="keyboard-bg" v-if="isShowKeyboard1||isShowKeyboard2" v-tap="{fn:hideKeyboard}"></div> -->
  <!-- <div class='tips'>
    请核对本人银行卡信息
  </div> -->
  <div class="input-row ">
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>银行卡号</div>
        <div class="tap-area" >
          <div >{{cardNo|bankFormat}}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="input-row ">
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>卡类型</div>
        <div class="tap-area" >
          <div >{{bankName +' '+cardTypeCn}}</div>
        </div>
        <!-- <i class=" icon-clear " v-show='bankNumber.length!==0' v-tap='{fn:clearInput}'></i> -->
      </div>
    </div>
  </div>

  <div class="input-row" v-if='cardType==="2"&&creditCardExpirationDateSwitch==="1"'>
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>有效期</div>
        <div class="tap-area" v-tap='{fn:showSelector}'>
          <div v-if='effectedTime.length===0' class="placeholder-txt"><span>输入有效期 月份/年份 例09/22</span></div>
          <span >{{effectedTime}}</span>
        </div>
        <i class=" icon-clear " v-show='effectedTime.length!==0' v-tap='{fn:clearInputTime}'></i>
      </div>
    </div>
  </div>
  <div class="input-row" v-if='cvv2Mark=="1"'>
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title' >卡安全码</div>
        <input id='safe' type="number" placeholder="卡背面后三位数字" @input="limitLength" v-model='safeCode'/>
      </div>
    </div>
  </div>
  <div class='tips'>
    请填写此卡银行预留信息
  </div>
  <!-- 去掉本页面已激活用户显示姓名和身份证的部分 -->
  <div class="input-row " v-if='defaultFlag===0'>
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>姓名</div>
        <input @focus="hideKeyB" v-if='defaultFlag===1' readonly id="name" type="text" maxlength="19"  placeholder="输入真实姓名" v-model='realName'>
        <input @focus="hideKeyB" v-else-if='defaultFlag===0'  id="name" type="text" maxlength="19"  placeholder="输入真实姓名" v-model='realName' @click="instance.hide()">
      </div>
    </div>
    <a class="not-me" :href="toModify" v-if='defaultFlag===1' name='wap_authentication_secondtstep_not_button' @click='buryPoint'>不是本人？</a>
  </div>
  <div class="input-row " v-if='defaultFlag===0'>
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>身份证</div>
        <div class="tap-area" @click="showKeyboard1">
          <div v-if='idCard.length===0' class="placeholder-txt"><span>输入身份证号</span></div>
          <span v-else>{{idCard|idCardFormat}}</span><em class="cursor-frame" v-show="isShowKeyboard1"></em>
        </div>
        <i class=" icon-clear " v-show='this.isShowKeyboard1&&idCard.length!==0&&defaultFlag===0' v-tap='{fn:clearInputIdCard}'></i>
      </div>
    </div>
    <div class='error-message' v-if='idCardErrorMessage.length!==0'>
      <span class='content'></span>{{idCardErrorMessage}}
      
    </div>
  </div>
  <div class="input-row ">
    <div class='input-wrapper'>
      <div class='input-border'>
        <div class='title'>手机号</div>
        <div class="tap-area" @click="showKeyboard2">
          <div v-if='phoneNumber.length===0' class="placeholder-txt"><span>输入银行卡预留手机号</span></div>
          <span v-else class='phone-number'>{{phoneNumber|phoneFormat}}</span><span class='modify' v-if='phoneNumber.indexOf("*")>-1' @click='modifyPhoneNum'>修改</span><em class="cursor-frame" v-show="isShowKeyboard2"></em>
        </div>
        <i class=" icon-question-mark " @click='reservedPhone'></i>
        <i class=" icon-clear " v-show='this.isShowKeyboard2&&phoneNumber.length!==0' v-tap='{fn:clearInputPhoneNumber}'></i>
      </div>
    </div>
    <div class='error-message' v-if='phoneNumberErrorMessage.length!==0&&!isShowKeyboard2'>
      <span class='content'></span>{{phoneNumberErrorMessage}}
    </div>
    <div class='tel-tip' v-if='isShowKeyboard2&&phoneNumber.length==0'>
      <span @click='writePhone'>{{bankPhone}}</span><span>账户绑定手机号</span><i class='arrow'></i>
    </div>
  </div>
  
  <div class='heightDiv'></div>
  <div class='service-agreement'>
    <input type="checkbox" v-model='isChecked' name="" id="agreementbox">
    <label for="agreementbox" class='label-box'></label>
    <label for="agreementbox"><span>我已阅读并同意</span></label><a class='service-link'  name='wap_authentication_secondtstep_agreement_button' @click='buryPoint($event);goAgreement()' >《服务协议》</a>
  </div>
  <Button :isDisabled='isDisabled' style='width:3.43rem' @tapEvent='confirm();buryPoint($event)' name='wap_authentication_secondtstep_next_button'>验证银行卡</Button>
  <!-- <div class='ext-info'><img class='ext-info-icon' src='../assets/Group 4 Copy@3x.png'>信息已加密，仅用于银行验证</div> -->
  <footerCom></footerCom>
  <div v-if='isShowKeyboard1||isShowKeyboard2' :style='{"height":keyboardInsertDiv}'></div>
  <no-ssr placeholder="Loading...">
    <keep-alive>
      <Selector :valueKey="'name'" v-if="isShowSelector" :showToolbar="showToolbar" :items="dateItem" @change="onDateChange" :visible-item-count="3" :complete="selectorComplete" :cancel="selectorClose">
      </Selector>
    </keep-alive>
  </no-ssr >
  <XModal2 v-model='xmodalShow'></XModal2>
</div>        
</template>
<script>
import Keyboard from "~/components/keyboard2/keyboard.js";
import Button from "~/components/button";
import Selector from "~/components/selector/selector";
import footerCom from "~/components/footer";
import XModal2 from "~/components/XModal2";
import topBar from "~/components/topBar";
import urls from '~/api/urls'
import api from '~/api/api'

export default {
  name: "index",
  components: {
    Button,
    Selector,
    footerCom,
    XModal2,
    topBar
  },
  computed: {
    isDisabled() {
      var res=false
      if (this.creditCardExpirationDateSwitch === "1"&&!this.effectedTime) {
        res=true
      }
      if (this.cvv2Mark === "1"&&!this.safeCode) {
        res=true
      }
      if(
          !(this.realName &&
          this.idCard.length===18 &&
          this.phoneNumber.length===11 &&
          this.isChecked)
      ) {
        res=true
      }
      return res
    },
    pkEncryptSwitch(){
      return this.$store.state.pkEncryptSwitch
    }
  },
  filters: {
    bankFormat: function(value) {
      if (!value) return "";
      value = value.toString();
      if (/\S{5}/.test(value)) {
        value = value.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
      }
      return value;
    },
    phoneFormat: function(value) {
      if (!value) return "";
      value = value.toString();
      value = value.replace(/\s/g, "");
      if(value.indexOf('*')===-1){
        if(value.length>3){
          value=value.slice(0,3)+' '+value.slice(3,7)+' '+value.slice(7)
        }
      }
      return value;
    },
    idCardFormat:function(value){
      if (!value) return "";
      value = value.toString();
      value = value.replace(/\s/g, "");
      if(value.indexOf('*')==-1){
        value=value.slice(0,6)+' '+value.slice(6,14)+' '+value.slice(14)
      }
      return value;
    }
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
     api.initBankInfo({}).then(res=>{}).catch(err=>{})
  },
  created() {
    if(process.client){
      this.toModify = urls.toModify;
      this.toAgreementUrl = urls.toAgreementUrl;
      this.screenH = document.body.clientHeight;
    }
  },
  activated() {
    this.initBankInfo();
    this.initKeyboard();
    this.clicked = false;
    setTimeout(()=>{
      sa.click.sendDatasIndex(document.getElementById("identityMaidian"));
    },200)
    
  },
  deactivated() {
    this.instance.hide();
  },
  mounted: function() {
    var _this=this
    this.screenH = document.body.clientHeight;
    window.onresize = function() {
      if (_this.screenH - window.innerHeight < 10) {
        document.getElementsByClassName("pagefoot")[0].style.display = "flex";
      } else {
        document.getElementsByClassName("pagefoot")[0].style.display = "none";
      }
    };
  },
  methods: {
    limitLength(event){
      event.target.value=event.target.value.slice(0,3)
      this.safeCode=event.target.value
    },
    rsa(str){
      //1217银行卡加密
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(pubKey);
      return encrypt.encrypt(str);
    },
    modifyPhoneNum(){
      this.phoneNumber='';
      this.showKeyboard2();
    },
    /* 
      点击银行卡号码自动输入
      @params
    */
    writePhone(){
      this.phoneNumber=this.bankPhone;
      // this.isDefaultPhone=true;
      this.phoneNumberErrorMessage="";
      this.instance.hide()
    },
    goAgreement(){
      this.$router.push({name:'newRealName-agreement'})
    },
    reservedPhone(){
      this.xmodalShow=true;
    },
    buryPoint($event) {
      try {
        sa.click.sendDatasIndex($event.currentTarget);
      } catch (e) {}
    },
    hideKeyB(e) {
      // e.preventDefault()
      this.hideKeyboard();

    },
    confirm() {
      if (this.clicked) {
        return;
      }
      let errMessage = this.confirmValidate();
      if (!errMessage) {
        this.clicked = true;
        this.$pageLoadingBox.show();
        this.hideKeyboard();
        let _this = this;
        var useBindMobileFlag=this.phoneNumber.indexOf('*')>-1?'1':'0';
        var rsaRealName = "";
        var rsaIdCard = "";
        var rsaPhone = "";
        if(this.pkEncryptSwitch == "1"){
          rsaRealName= _this.rsa(_this.realName.replace(/\s/g,'').replace(/•/,'·').replace(/·+/,'·'));
          rsaIdCard= _this.rsa(_this.idCard);
          rsaPhone= _this.rsa(_this.phoneNumber);
        }else{
          rsaRealName= _this.realName.replace(/\s/g,'').replace(/•/,'·').replace(/·+/,'·');
          rsaIdCard= _this.idCard;
          rsaPhone= _this.phoneNumber;
        }
        let params={
            name: _this.defaultFlag ? "" :rsaRealName,
            idNo: _this.defaultFlag ? "" : rsaIdCard,
            mobile:useBindMobileFlag==='1'?'': rsaPhone,
            expYear: _this.creditCardExpirationDateSwitch === "1" ? _this.expYear : "",
            expMonth: _this.creditCardExpirationDateSwitch === "1" ? _this.expMonth : "",
            cvv2: _this.cvv2Mark === "1" ? _this.safeCode : "",
            useBindMobileFlag:useBindMobileFlag
          }
        api.sendQuickSignAndValidateBankInfo(params).then(res=>{
           this.clicked = false;
            if (res.data.responseCode === "0000") {
              this.$pageLoadingBox.hide();
              window.phoneNumber = this.phoneNumber;//待修改
              window.identityParams = params;
              this.$router.push({ name: "newRealName-validatePhone" });
              if (this.$bus.$validatePhone) {
                this.$bus.$validatePhone.countdown();
              }
            } else {
              this.$pageLoadingBox.hide();
              this.$toastAlertBox.show({
                type: "alertBox",
                msg: res.data.responseMsg || "系统异常，请稍后再试",
                confirmBtn: "确认",
                closeCallback: function() {},
                confirmCallback: function() {},
              });
            }
        }).catch(err=>{
          console.log(err);
          
          this.clicked = false;
          this.$pageLoadingBox.hide();
          this.showToast();
        })
      } else {
        this.$toastAlertBox.show({
          type: "alertBox",
          msg: errMessage,
          confirmBtn: "确认",
          confirmCallback: function() {}
        });
      }
      
    },
    hideKeyboard() {
      this.instance.hide();
      this.isShowKeyboard1 = false;
      this.isShowKeyboard2 = false;
    },
    showSelector() {
      this.instance.hide();
      this.isShowSelector = true;
    },
    /**
     *取消时间选择  点击取消和黑背景调用
     */
    selectorClose(data) {
      this.isShowSelector = false;
      this.effectedTime = this.effectedTimeCopy;
    },
    /**
     * 完成selector
     */
    selectorComplete(data) {
      this.isShowSelector = false;
      
      this.effectedTime = data[0] + "/" + data[1];
      this.effectedTimeCopy = data[0] + "/" + data[1];
      this.expMonth = data[0];
      this.expYear = data[1].substring(data[1].length-2);
      console.log(data[1].substring(data[1].length-2));
    },
    /**
     * 切换selector选项
     */
    onDateChange(args, data, index) {
      this.effectedTime = data[0] + data[1];
    },
    /**
     * 提交前校验
     */
    confirmValidate() {
      let errMessage = "";
      if (
        this.creditCardExpirationDateSwitch === "1" &&
        !this.effectedTime
      ) {
        if (!this.isCardID(this.idCard)) {
          errMessage = "请输入有效期";
          return errMessage;
        }
      }
      if(this.cvv2Mark=='1'&&this.safeCode.length!=3){
          errMessage = "请输入3位安全码";
          return errMessage;
      }
      if (!this.defaultFlag) {
        var nameValue=this.realName.replace(/\s/g,'')
        if (!this.realName) {
          return (errMessage = "请输入姓名");
        }

        if(!/^([\u4E00-\u9FA5]|[\uE7C7-\uE7F3]|\u4DAE|[·]|[•]){1,21}$/.test(nameValue)){
          return (errMessage = "请输入正确的姓名");
        }
        //检测前面空格
        if(!/([\u4E00-\u9FA5]|[\uE7C7-\uE7F3])/.test(nameValue.substring(0,1))){
          return (errMessage = "请输入正确的姓名");
        }
        //检测后面空格
        if(!/([\u4E00-\u9FA5]|[\uE7C7-\uE7F3])/.test(nameValue.charAt(nameValue.length-1))){
          return (errMessage = "请输入正确的姓名");
        }
        if (!this.isCardID(this.idCard)) {
          this.idCardErrorMessage = "请输入正确的身份证号";
          return (errMessage = "身份证输入有误");
        }
      }
      if (!(/^\d{11}$/.test(this.phoneNumber)||this.phoneNumber.indexOf('*')>-1)) {
        this.phoneNumberErrorMessage = "请输入正确的手机号";
        return (errMessage = "请输入正确的手机号");
      }
      return "";
    },
    validate(type) {
      if (type === 1) {
        if (this.isCardID(this.idCard)) {
          this.idCardErrorMessage = "";
        } else {
          if (this.idCard.length) {
            this.idCardErrorMessage = "请输入正确的身份证号";
          } else {
            this.idCardErrorMessage = "请输入身份证";
          }
        }
      }
      if (type === 2) {
        if(this.phoneNumber.indexOf('*')>-1){
          this.phoneNumberErrorMessage=""
          return
        }
        if (/^\d{11}$/.test(this.phoneNumber)) {
          this.phoneNumberErrorMessage = "";
        } else {
          if (this.phoneNumber.length === 0) {
            this.phoneNumberErrorMessage = "请输入手机号";
          } else {
            this.phoneNumberErrorMessage = "手机号输入有误";
          }
        }
      }
    },
    /**
     * 清除输入框
     */
    clearInputName() {
      this.realName = "";
    },
    clearInputTime() {
      this.effectedTime = "";
      this.expYear = "";
      this.expMonth = "";
    },
    clearInputIdCard() {
      this.idCard = "";
    },
    clearInputPhoneNumber() {
      // this.isDefaultPhone=false
      this.phoneNumber = "";
      // this.useBindMobileFlag='0'
    },
    showKeyboard1() {
      if (this.defaultFlag) {
        return;
      }
      if(Math.abs(this.screenH-window.innerHeight)<10){
        this.instance.setKeyboardType("simple-idcard");
        this.instance.show();
        this.isShowKeyboard2 = false;
        this.isShowKeyboard1 = true;
      }
    },
    showKeyboard2() {
      // debugger
      // this.validate(1);
      if(this.phoneNumber.indexOf("*")>-1){
        return
      }
      if(Math.abs(this.screenH-window.innerHeight)<10){
        this.instance.setKeyboardType("simple-num");
        this.instance.show();
        this.isShowKeyboard1 = false;
        this.isShowKeyboard2 = true;
      }
    },
    initKeyboard() {
      let instance = new Keyboard({
        keyboardType: "simple-num",
        position: "fixed",
        completeFn: _this => {
          // debugger
          if (this.isShowKeyboard1) {
            this.validate(1);
            this.isShowKeyboard1 = false;
            this.isShowKeyboard2 = false;
          }else if (this.isShowKeyboard2) {
            this.validate(2);
            this.isShowKeyboard1 = false;
            this.isShowKeyboard2 = false;
          }
        },
        deleteFn: _this => {
          if (this.isShowKeyboard1) {
            this.idCard = this.idCard.substr(0, this.idCard.length - 1);
          } else if (this.isShowKeyboard2) {
            // if(!this.isDefaultPhone){
            this.phoneNumber = this.phoneNumber.substr(
              0,
              this.phoneNumber.length - 1
            );
            // }else{
            //   this.phoneNumber=''
            // }
            
          }
        },
        callbackFn: (val, e) => {
          if (this.isShowKeyboard1) {
            if (this.idCard.length === 18) {
              return;
            }
            this.idCard += val;
            if (this.idCard.length >= 18) {
              this.validate(1);
              return;
            }
          }
          if (this.isShowKeyboard2) {
            if (this.phoneNumber.length >= 11) {
              return;
            }
            if (this.phoneNumber.length === 0 && val !== "1") {
              return;
            }
            this.phoneNumber += val;
            if (this.phoneNumber.length >= 11) {
              this.validate(2);
            }
          }
        },
        afterEnterFn: o => {
          setTimeout(() => {
            let btn = document.getElementsByClassName("block-btn")[0];
            let tip = document.getElementsByClassName("tips")[1];
            // document.documentElement.style.height =document.documentElement.scrollHeight + tip.offsetTop + "px";//撑高html

            // o.top-btn.offsetTop<100
            // document.documentElement.scrollTop=tip.offsetTop;
            // this.upSports(tip);
          }, 0);
        }
      });
      this.instance = instance;
    },
    upSports(tip) {
      let startTop = tip.offsetTop;
      let speed = 0;
      let uptimer = setInterval(() => {
        if (document.documentElement.scrollTop >= startTop) {
          clearInterval(uptimer);
          return;
        }
        speed = Math.ceil(tip.scrollTop / 8);
        document.documentElement.scrollTop = speed;
      }, 20);
    },
    initBankInfo() {
      this.$pageLoadingBox.show();
      api.initBankInfo({}).then(res=>{
        this.$pageLoadingBox.hide();
        if (res.data.responseCode === "0000") {
          this.cardNo=res.data.cardNo;
          this.cardType = res.data.cardType;
          this.bankName = res.data.bankName;
          this.cardTypeCn = res.data.cardTypeCn;
          this.creditCardExpirationDateSwitch =res.data.indate;//res.data.creditCardExpirationDateSwitch;
          this.cvv2Mark =res.data.cvv2;
          this.bankPhone=res.data.mobileNo;
          if (res.data.userName) {
            this.defaultFlag = 1;
            this.realName = res.data.userName;
            this.idCard = res.data.idNo;
          }
        }
      }).catch(err=>{
        this.$pageLoadingBox.hide();
        this.showToast();
      })
    },
    /**
     * 校验身份证
     */
    isCardID(sId) {
      if (this.defaultFlag === 1) {
        // debugger
        return true;
      }
      let ID_PATTERN = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      return ID_PATTERN.test(sId);
    },
    getData: function(opt) {
      this.$http
        .get(opt.url, {
          params: opt.params || {}
        })
        .then(res => {
          opt.success && opt.success(res);
        })
        .catch(err => {
          opt.error && opt.error(err);
        });
    },
    showToast: function(val) {
      this.$toastAlertBox.show({
        type: "toast",
        msg: val || "网络繁忙，请稍后再试"
      });
    }
  },
  data() {
    return {
      clicked: false,
      isChecked: true,
      toModify: "", //不是本人链接
      idKeyboard: "",
      defaultFlag: 0, //是否带出默认信息 激活的用户会带出
      keyboardInsertDiv: "0px",
      isShowSelector: false, //显示selector
      showToolbar: true, //selector工具条
      showClearIcon: true, //显示清空图标
      isShowKeyboard1: false,
      isShowKeyboard2: false,
      cardType: "1",
      cardTypeCn: "",
      creditCardExpirationDateSwitch: "",
      cvv2Mark:'',
      cardNo:"",
      bankName: "",
      realName: "",
      phoneNumber: "", //手机号码
      bankPhone:'',//提示的银行卡手机号
      // useBindMobileFlag:'0',
      // isDefaultPhone:false,
      xmodalShow:false,
      idCard: "", //身份证
      idCardErrorMessage: "",
      phoneNumberErrorMessage: "",
      effectedTimeCopy: "",
      effectedTime: "",
      expYear: "",
      expMonth: "",
      safeCode:'',
      dateItem: [
        {
          flex: 1,
          values: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12"
          ],
          textAlign: "center",
          itemHeight: 50
        },
        {
          flex: 1,
          values: [
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
            "2025",
            "2026",
            "2027",
            "2028",
            "2029",
            "2030",
            "2031",
            "2032",
            "2033",
            "2034",
            "2035",
            "2036",
            "2037",
            "2038",
            "2039",
            "2040",
            "2041",
            "2042",
            "2043",
            "2044",
            "2045",
            "2046",
            "2047",
            "2048",
            "2049",
            "2050",
          ],
          textAlign: "center",
          itemHeight: 50
        }
      ]
    };
  }
};
</script>

<style lang="scss"  scoped>
@import "~/assets/css/_function.scss";
.keyboard-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0.88rem;
  left: 0;
  z-index: 9998;
}
.service-agreement {
  font-size: 0.12rem;
  padding: 0.1rem 0 0.1rem 0.16rem;
  .service-link {
    color: #017ff2;
  }
}

.label-box {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: url(../../assets/img/icon_nochecked@3x.png) no-repeat center;
  background-size: 0.12rem 0.12rem;
}
#agreementbox:checked + .label-box {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: url(../../assets/img/icon_checked@3x.png) no-repeat center;
  background-size: 0.12rem 0.12rem;
}
input {
  background: none;
  border: none;
  outline: none;
  padding: 0;
}
input::-webkit-input-placeholder {
  color: #cacaca !important;
}

input:-moz-placeholder {
  /* Firefox 18- */
  color: #cacaca !important;
}

input::-moz-placeholder {
  /* Firefox 19+ */
  color: #cacaca !important;
}

input:-ms-input-placeholder {
  color: #cacaca !important;
}
.input-row input {
  width: 75%;
  margin-left: 20%;
  height: 0.44rem;
  line-height: 0.2rem;
  font-size: 0.16rem;
  color: #333;
  overflow: hidden;
  display: block;
}
.heightDiv {
  height: 0.6rem;
}
.index {
  // position: relative;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}
.placeholder-txt {
  font-size: pxrem(16px);
  color: #cacaca;
  line-height: 0.44rem;
  position: absolute;
}
.input-row {
  position: relative;
  // height: 0.44rem;
  line-height: 0.44rem;
  // background-color: #ffffff;
  font-size: 0;
  // border-bottom: 1px solid rgba(225, 225, 225, 0.5);
  // padding-left: 0.16rem;
  .tel-tip{
    position: relative;
    height: 0.48rem;
    background: #F2F2F2;
    font-family: PingFangSC-Regular;
    font-size: 0.14rem;
    color: #333333;
    line-height: 0.48rem;
    padding-left: 0.16rem;
    .arrow{
      position: absolute;
      width: 0.2rem;
      height: 0.2rem;
      background: #F2F2F2;
      display: block;
      transform: rotate(45deg);
      top:-0.04rem;
      left:45%;
    }
    span:first-child{
      margin-left:19%
    }
    span:nth-child(2){
      color: #CACACA;
      margin-left:10px; 
    }
  }
}
.input-row .input-border {
  height: 0.44rem;
  border-bottom: 1px solid rgba(232, 232, 232, 0.445);
}
.input-row .title {
  text-align: left;
  font-size: 0.16rem;
  height: 0.44rem;
  line-height: 0.44rem;
  color: #333333;
  width: 20%;
  float: left;
}

.tap-area {
  color: #333333;
  position: relative;
  margin-left: 20%;
  overflow: hidden;
  font-size: pxrem(16px);
  height: 0.44rem;
}
.phone-number{
  float: left;
}
.modify{
  font-size: 0.13rem;
  color: #247CF0;
  float: left;
  margin-left:0.1rem;
}
.icon-question-mark{
  background: url(../../assets/img/Group.png);
  background-size: 0.2rem;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  right: 0.09rem;
  width: 0.3rem;
  height: 0.44rem;
  top: 0;
  text-align: center;
  vertical-align: middle;
}
.icon-clear {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACpUlEQVRYR81X0XHbMAwFyAHqbuBOUPPI/7oTNJmg6QR1JmgzQZMJ4k5Qd4Ik/+IpnqAewR1AYu/xSJ8iixIl173iy3eCiQcQ7xFgGmFFUVww8wfn3JyIZsy8wN+dc89EtGfmnRBio5T6mXssDzmWZTmv6/oLEV0g6JB/+L4noo0Q4lophd9J6wVgrf1KRJ9HBG4HQvBbrfVNCkEngLIsZ1VVPcQSZ2addMMVSSnfd1XjCEBZlou6rh9OyDoFZC+EAAj0y8FeAEDmdV3/OkPwGBAg3jQrcQDwt8ueKgOuwxij4vcDgNBw6PZ/YTdaazQ4eQCBauUZS3/EjngVHkBRFGtm/thTtu9SynVVVSsIUV+JnHPR92roTGPMVQQAFXuVOjh07+MQWATHoaGqy8CmJCu01q85yOuPgaxe8DhRsWut9W0InqUjzrlLAOgtfwTWFhNr7YqIvoXvn7TW6xAcOoKE8F4M2R1ba1Had0Oe4Tsem8soJtZaX+5W8DEi9gQAUKa3mQDg1qloUxQUVQUANyJ4U9GUUmp3Ko0nAWh2e0SU20vtZEdfQYtqfj6I2j4BxHZsEza73VMNAJpPrbUWVMQMkWNP2TQkojbVDt0eKAp2+J4I7LjPQHCXJURE1BSZ1Lzwgh0tnejE4oUoyGuvFMPRGLPJoNoBxJDCOud+G2NmWY8RuO85y7zMKCum5McwziWH2NjM8TlGQ+36HqScwLk+yF5KOQd7/o+BJCKfIMu5STf9tlprv9DAjobSc15Fs/SdAIKuL6qqQhMlB5QpaYfgy96xPB4cxnM802NeyT5cWyEEgh+taYOrmXMOc+CkaiBrZsZq5ifgLstZTkFR6Ds24ywgCIzlVEq5Omk5bSOGugUgfj1vXNEWYkVEzxAhqGZun/wBYQe4CixoE6EAAAAASUVORK5CYII=);
  background-size: 0.14rem;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  right: 0.49rem;
  width: 0.3rem;
  height: 0.44rem;
  top: 0;
  text-align: center;
  vertical-align: middle;
}
.tips {
  font-size: 0.13rem;
  color: #999999;
  text-align: left;
  padding-left: 0.15rem;
  margin-bottom: 0.1rem;
  padding-top: 0.16rem;
}
.tips2 {
  font-size: 0.12rem;
  color: #999999;
  padding-left: 0.15rem;
  margin-bottom: 0.16rem;
}
section {
  width: 2.59rem;
  margin: 0 auto;
  margin-top: 2.34rem;
}
.bottom-tips {
  font-size: 0.12rem;
  color: #999999;
  text-align: center;
  line-height: 0.2rem;
}
.icons ul {
  display: flex;
  justify-content: space-between;
  li {
    img {
      width: 0.32rem;
      height: 0.32rem;
      display: block;
      margin: 0 auto;
    }
    span {
      display: block;
      text-align: center;
    }
  }
}
.input-wrapper {
  padding-left: 0.16rem;
  background: #fff;
}
.error-message {
  font-size: 0.13rem;
  color: #ff5656;
  // letter-spacing: 0;
  line-height: 0.13rem;
  padding-left: 0.16rem;
  padding-top: 0.08rem;
  padding-bottom: 0.14rem;
  .content {
    display: inline-block;
    width: 20%;
  }
}
.cursor-frame {
  position: relative;
  // display: inline-block;
  border-right: 0.024rem solid;
  -moz-border-radius: 0.024rem;
  -webkit-border-radius: 0.024rem;
  border-radius: 0.02rem;
  height: 60%;
  color: #3399ff;
  background-color: #3399ff;
  -webkit-animation: cursorAni 1s infinite linear;
  animation: cursorAni 1s infinite linear;
  z-index: 99;
}
@-webkit-keyframes cursorAni {
  0%,
  50% {
    opacity: 1;
  }
  60%,
  100% {
    opacity: 0;
  }
}
@keyframes cursorAni {
  0%,
  50% {
    opacity: 1;
  }
  60%,
  100% {
    opacity: 0;
  }
}
.not-me {
  position: absolute;
  font-size: 0.12rem;
  top: 0;
  right: 0.05rem;
  color: #017ff2;
}
.ext-info {
  font-size: 0.12rem;
  color: #999999;
  text-align: center;
  line-height: 0.2rem;
  margin-top: 0.2rem;
  position: absolute;
  bottom: 0.2rem;
  left: 50%;
  transform: translateX(-50%);
}
.ext-info-icon {
  height: 0.16rem;
  vertical-align: sub;
  margin-right: 0.05rem;
}
</style>
