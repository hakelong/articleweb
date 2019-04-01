<template>
<div class='index'>
  <topBar>{{this.textConfigTitle}}</topBar>
  <div id='indexMaidian' name='wap_authentication_firststep' display='none'></div>
  <div class='specialtip' v-if='textConfigText'>
    <img src="~/assets/img/laba@2x.png" class='icon'>
    <span>{{textConfigText}}</span>
  </div>
  <div class='input-row name-tip-box' v-if='name?true:false'>
    <div class='input-border'>
      <div class='name-tip'>请绑定本人银行卡</div>
    </div>
  </div>
  <div class='input-row' v-if='name?true:false'>
    <div class='input-border'>
      <div class='title'>姓名</div>
      <div class="tap-area">
        <span v-text='name'></span><i class='notme' @click='showModify'></i>
      </div>
    </div>
  </div>
  
  
  <div class="input-row ">
    <div class='input-border'>
      <div class='title'>银行卡号</div>
     
      <div class="tap-area"  @click='showKeyboard' >

        <div v-if='bankNumber.length===0' class="placeholder-txt"><span unselectable="on">信用卡/储蓄卡卡号</span></div>
        <em class="cursor-frame" v-show="isShowKeyboard&&emIndex==-1"></em>
        <template v-for='(num,index) in bankNumberArr' >
          <span :key='index' @click='changeEmIndex(index)'>{{num}}</span><em class="cursor-frame" v-show="isShowKeyboard&&index==emIndex" :key='index+"em"'></em><span v-show='addSpace(index)' :key='index+"space"'>&nbsp;</span>
        </template>  

      </div>
      <i class=" icon-clear " v-show='isShowKeyboard&&bankNumber.length!==0' v-tap='{fn:clearInput}'></i>
    </div>
  </div>
  <div v-if='showBankList' class='supportbank'>支持交通银行、中国银行、工商银行，<router-link :to="{ name: 'bankList'}"><span class='link-class'>更多</span></router-link></div>
  <div class='heightDiv'></div>

  <Button :isDisabled='isDisabled' style='width:3.43rem' @tapEvent='go();buryPoint($event)' name='wap_authentication_firststep_next_button'>下一步</Button>
  <section class='foot-section'>
    <div class='bottom-tips'>
      实名用户，可使用支付、理财等金融服务
    </div>
    <div class='icons'>
      <ul>
        <li class='single'>
          <img src="~/assets/img/i2@3x.png" alt="">
          <span>账户安全</span>
        </li>
        <li class='single'>
          <img src="~/assets/img/i1@3x.png" alt="">
          <span>提升支付额度</span>
        </li>
        <li class='single'>
          <img src="~/assets/img/i3@3x.png" alt="">
          <span>专属特权</span>
        </li>
      </ul>
    </div>
  </section>
  <footerCom>信息已加密，仅用于验证银行卡</footerCom>
  <XModal v-model='ifNotmeShow'  @modalClose='toChange'></XModal>
  <div id='wap_authentication_secondtstep_not_button' name='wap_authentication_secondtstep_not_button' display='none'></div>
</div>        
</template>
<script>
import Keyboard from "~/components/keyboard2/keyboard.js";
import Button from "~/components/button";
import XModal from "~/components/XModal3";
import footerCom from "~/components/footer";
import topBar from "~/components/topBar";
import api from '~/api/api'

export default {
  name: "index",
  components: {
    Button,
    XModal,
    footerCom,
    topBar
  },
  computed: {
    isDisabled() {
      return !(this.bankNumber.length > 6 && this.bankNumber.length < 20);
    },
    bankNumberArr() {
      return this.bankNumber.split("");
    },
    showBankList(){
      return this.$store.state.bankListShowSwitch=='1'?true:false
    },
    textConfigTitle(){
      return this.$store.state.textConfigTitle
    },
    textConfigText(){
      return this.$store.state.textConfigText
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
    }
  },
  asyncData(ctx){
    return api.initBankNum().then(res=>{
        if(res.data.responseCode=='0000'){
          if (res.data.cardNo) {
            var bankNumber = res.data.cardNo;
          }
          if(res.data.userName){
            var name=res.data.userName
          }
          if(res.data.idNo){
            var idCard=res.data.idNo;
          }
          return {
            bankNumber,
            name,
            idCard
          }
        }
      }).catch(err=>{

      })
  },
  fetch({store}){
  },
  created: function() {
    if (!this.textConfigTitle) {
      this.textConfigTitle = "实名认证";
    }
  },
  activated() {
    // this.initBankNum();
    try {
      sa.click.sendDatasIndex(document.getElementById("indexMaidian"));
    } catch (err) {
      setTimeout(() => {
        sa.click.sendDatasIndex(document.getElementById("indexMaidian"));
      }, 500);
    }
  },
  deactivated() {
    this.instance.hide();
  },
  mounted: function() {
    this.initKeyboard();
  },
  methods: {
    toChange(){
      try {
        sa.click.sendDatasIndex(document.querySelector('#wap_authentication_secondtstep_not_button'));
      } catch (e) {}
      // console.log(event)
      window.location.href=window.toModify
    },
    showModify(){
      this.ifNotmeShow=!this.ifNotmeShow
    },
    rsa(str){
      //1217银行卡加密
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(pubKey);
      return encrypt.encrypt(str);
    },
    dopaste(){
      setTimeout(() => {
        document.execCommand('paste')
      }, 1000);
      
    },

    addSpace(index) {
      if (index == 3 || index == 7 || index == 11 || index == 15) {
        return true;
      } else {
        return false;
      }
    },
    changeEmIndex(index) {
      this.emIndex = index;
    },
    buryPoint($event) {
      try {
        sa.click.sendDatasIndex($event.currentTarget);
      } catch (e) {}
    },
    initBankNum() {
      api.initBankNum().then(res=>{
        if(res.data.responseCode=='0000'){
          if (res.data.cardNo) {
            this.bankNumber = res.data.cardNo;
          }
          if(res.data.userName){
            this.name=res.data.userName
          }
          if(res.data.idNo){
            this.idCard=res.data.idNo;
          }
        }
      }).catch(err=>{

      })
    },
    validate() {
      if (this.bankNumber.length < 16 || this.bankNumber.length > 19) {
        this.errMessage = "长度必须在16到19位";
      } else {
        this.errMessage = "";
      }
    },
    go() {
      this.instance.hide();
      this.$pageLoadingBox.show();
      var bankNumberRSA = "";
      if(this.pkEncryptSwitch == "1"){
          bankNumberRSA = this.rsa(this.bankNumber);
        }else{
          bankNumberRSA = this.bankNumber;
        }
      api.go({cardNo: bankNumberRSA}).then(res=>{
        this.$pageLoadingBox.hide();
          if (res.data.responseCode === "0000") {
            this.$router.push({ name: "newRealName-identity" });
          } else {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "确认",
              confirmCallback: () => {
              }
            });
          }
      }).catch(err=>{
        this.showToast();
      })

    },
    /**
     * 清除输入框
     */
    clearInput() {
      this.bankNumber = "";
      this.emIndex = -1;
    },
    showKeyboard() {
      this.instance.show();
      this.isShowKeyboard = true;
    },
    initKeyboard() {
      let instance = new Keyboard({
        keyboardType: "simple-num",
        position: "fixed",
        completeFn: _this => {
          this.isShowKeyboard = false;
        },
        deleteFn: _this => {
          if (this.emIndex > -1) {
            var templatearr = this.bankNumber.split("");
            templatearr.splice(this.emIndex, 1);
            this.bankNumber = templatearr.join("");
            this.emIndex -= 1;
            // console.log('this.emIndex>>>>'+this.emIndex)
          }
        },
        callbackFn: (val, e) => {
          // console.log('数字》》'+val)
          if (this.bankNumber.length >= 19) {
            return;
          }
          var tempArr = this.bankNumber.split("");
          tempArr.splice(this.emIndex + 1, 0, val);
          this.bankNumber = tempArr.join("");
          this.emIndex += 1;
        },
        afterEnterFn: o => {}
      });
      this.instance = instance;
    },
    postData: function(opt) {
      this.$http
        .post(opt.url, opt.params || {})
        .then(res => {
          opt.success && opt.success(res);
        })
        .catch(err => {
          opt.error && opt.error(err);
        });
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
        msg:  "网络繁忙，请稍后再试"
      });
    }
  },
  
  data() {
    return {
      //激活用户默认展示
      name:'',
      idCard:'',
      // showBankList:window.bankListShowSwitch=='1'?true:false,//支持绑定银行列表开关
      showClearIcon: true, //显示清空图标
      isShowKeyboard: false,
      bankNumber: "",
      errMessage: "",
      emIndex: -1,
      //
      timeOutEvent: 0,
      // testInpuShow: false,
      testinput: "",
      ifNotmeShow:false
    };
  }
};
</script>

<style lang="scss" scoped >
@import '~/assets/css/_function.scss';
.supportbank {
  line-height: 0.4rem;
  font-size: 0.14rem;
  color: #999999;
  padding-left: 0.16rem;
  .link-class {
    color: #3399ff;
  }
}

.pasteinput-box {
  padding: 4px 0 0 0.16rem;
  span {
    margin-left: 20%;
  }
  input {
    outline: none;
    border: 1px solid #999999;
    height: 0.3rem;
  }
}
.specialtip {
  display: flex;
  height: 0.4rem;
  background: rgba(255, 162, 0, 0.2);
  font-family: PingFangSC-Regular;
  font-size: 0.13rem;
  color: #ff8000;
  line-height: 0.4rem;
  align-items: center;
  .icon {
    width: 0.2rem;
    height: 0.15rem;
    padding-left: 0.16rem;
    padding-right: 0.08rem;
  }
}
.heightDiv {
  height: 30px;
}
.index {
  // position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
}
.placeholder-txt {
  font-size: pxrem(16px);
  color: #cacaca;
  line-height: 0.44rem;
  position: absolute;
}

.name-tip{
  font-family: PingFangSC-Regular;
  font-size: 0.13rem;
  color: #999999;
}
.input-row {
  position: relative;
  height: 0.44rem;
  line-height: 0.44rem;
  background-color: #ffffff;
  font-size: 0;
  // border-bottom: 1px solid rgba(225, 225, 225, 0.5);
  padding-left: 0.16rem;
}
.name-tip-box{
  height: 0.3rem;
  line-height: 0.3rem;
  .input-border{
    height: 0.3rem!important;
  }
}
.input-row .error-message {
  font-size: 0.13rem;
  color: #ff5656;
  letter-spacing: 0;
  line-height: 0.13rem;
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
.input-row input {
  margin-left: 20%;
  height: 0.44rem;
  line-height: 0.2rem;
  font-size: 0.16rem;
  color: #333;
  overflow: hidden;
  display: block;
  width:75%;
}
input {
  background: none;
  border: none;
  outline: none;
  padding: 0;
}
.notme{
  display: inline-block;
  width: 0.13rem;
  height: 0.13rem;
  background-image:url('~assets/img/tipicon.png'); 
  background-size: 0.13rem;
  background-repeat: no-repeat;
  background-position: center;
  // position: absolute;
  // right: 0.09rem;
  // top: 0;
  text-align: center;
  vertical-align: middle;
  margin-left:0.1rem;
}
.tap-area {
  color: #333333;
  position: relative;
  margin-left: 20%;
  overflow: hidden;
  font-size: pxrem(16px);
  height: 0.44rem;
}

.icon-clear {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACpUlEQVRYR81X0XHbMAwFyAHqbuBOUPPI/7oTNJmg6QR1JmgzQZMJ4k5Qd4Ik/+IpnqAewR1AYu/xSJ8iixIl173iy3eCiQcQ7xFgGmFFUVww8wfn3JyIZsy8wN+dc89EtGfmnRBio5T6mXssDzmWZTmv6/oLEV0g6JB/+L4noo0Q4lophd9J6wVgrf1KRJ9HBG4HQvBbrfVNCkEngLIsZ1VVPcQSZ2addMMVSSnfd1XjCEBZlou6rh9OyDoFZC+EAAj0y8FeAEDmdV3/OkPwGBAg3jQrcQDwt8ueKgOuwxij4vcDgNBw6PZ/YTdaazQ4eQCBauUZS3/EjngVHkBRFGtm/thTtu9SynVVVSsIUV+JnHPR92roTGPMVQQAFXuVOjh07+MQWATHoaGqy8CmJCu01q85yOuPgaxe8DhRsWut9W0InqUjzrlLAOgtfwTWFhNr7YqIvoXvn7TW6xAcOoKE8F4M2R1ba1Had0Oe4Tsem8soJtZaX+5W8DEi9gQAUKa3mQDg1qloUxQUVQUANyJ4U9GUUmp3Ko0nAWh2e0SU20vtZEdfQYtqfj6I2j4BxHZsEza73VMNAJpPrbUWVMQMkWNP2TQkojbVDt0eKAp2+J4I7LjPQHCXJURE1BSZ1Lzwgh0tnejE4oUoyGuvFMPRGLPJoNoBxJDCOud+G2NmWY8RuO85y7zMKCum5McwziWH2NjM8TlGQ+36HqScwLk+yF5KOQd7/o+BJCKfIMu5STf9tlprv9DAjobSc15Fs/SdAIKuL6qqQhMlB5QpaYfgy96xPB4cxnM802NeyT5cWyEEgh+taYOrmXMOc+CkaiBrZsZq5ifgLstZTkFR6Ds24ywgCIzlVEq5Omk5bSOGugUgfj1vXNEWYkVEzxAhqGZun/wBYQe4CixoE6EAAAAASUVORK5CYII=);
  background-size: 0.14rem;
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
.tips {
  position: relative;
  font-size: 0.13rem;
  color: #999999;
  text-align: left;
  padding-left: 0.15rem;
  margin-bottom: 0.1rem;
  padding-top: 0.16rem;
  .red-packet {
    height: 0.3rem;
    position: absolute;
    top: 0.055rem;
  }
}
.tips2 {
  font-size: 0.12rem;
  color: #999999;
  padding-left: 0.15rem;
  margin-bottom: 0.16rem;
}
section {
  width: 2.6rem;
  margin:0 auto;
  margin-top:0.35rem;
  // margin: 0 auto;
  // position: absolute;
  // bottom: 0.6rem;
  // left: 50%;
  // transform: translateX(-1.3rem);
}
.bottom-tips {
  font-size: 0.12rem;
  color: #999999;
  text-align: center;
  line-height: 0.2rem;
  margin-bottom: 0.2rem;
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
      line-height: 0.3rem;
      font-size: 0.12rem;
      color: #999999;
    }
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
</style>
