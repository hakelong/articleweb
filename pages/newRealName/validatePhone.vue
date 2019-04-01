<template>
  <div class="index">
    <topBar>验证手机</topBar>
    <div id="yzmMaidian" name="wap_authentication_thirdtstep" display="none"></div>
    <div id="goUpload" name="wap_authentication_thirdtstep_abnormal_button" display="none"></div>
    <div class="tips">验证码已发送至</div>
    <div class="phone-num">{{phoneNum|hidePhone}}</div>
    <div class="input-row">
      <div class="input-border">
        <div class="title">验证码</div>
        <div class="tap-area" v-tap="{fn:showKeyboard}">
          <div v-if="yzm.length===0" class="placeholder-txt">
            <span>输入验证码</span>
          </div>
          <span v-else>{{yzm}}</span>
          <em class="cursor-frame" v-show="isShowKeyboard"></em>
        </div>
        <em class="icon-clear" @click="clearInput" v-if="yzm.length>0"></em>
        <span
          class="reSend"
          v-if="this.count===60"
          @click="reSend();buryPoint($event)"
          name="wap_authentication_thirdtstep_send_button"
        >重新发送</span>
        <span class="countdown" v-else>{{count+"s后重发"}}</span>
      </div>
    </div>
    <div class="not-receive">
      <span @click="canNotGetYzm">收不到验证码?</span>
    </div>
    <div class="heightDiv"></div>
    <Button
      :isDisabled="!(yzm.length>0)"
      style="width:3.43rem"
      @tapEvent="go();buryPoint($event)"
      name="wap_authentication_thirdtstep_next_button"
    >确认提交</Button>
    <XModal v-model="isYzmModalShow" :phoneNum="phoneNum"></XModal>
  </div>
</template>
<script>
import Keyboard from "~/components/keyboard2/keyboard.js";
import Button from "~/components/button";
import XModal from "~/components/XModal";
import { Common } from "~/assets/common/common";
import api from "~/api/api";
import utils from "~/utils/h5.js";

export default {
  name: "index",
  components: {
    Button,
    XModal
  },
  computed: {},
  filters: {
    hidePhone(val) {
      let reg = /(\d{3})\d{4}(\d{4})/;
      if (!val || val.length == 0) {
        return "";
      } else {
        return val.replace(reg, "$1****$2");
      }
    }
  },
  mounted: function() {
    this.$bus.$validatePhone = this;
    this.initKeyboard();
    this.countdown();
    let deviceInfo = Common.getDeviceInfo();
    if (deviceInfo.isEbuy) {
      this.dfpToken = utils.getCookie("dfpToken");
    }
  },
  created() {
    // this.getPhoneNumber();
  },
  activated() {
    this.getPhoneNumber();
    utils.buryingName(document.getElementById("yzmMaidian"));

    this.clicked = false;
  },
  deactivated() {
    this.instance.hide();
  },
  methods: {
    canNotGetYzm() {
      this.isYzmModalShow = true;
    },
    buryPoint($event) {
      // console.log($event.currentTarget.attributes.name)
      try {
        sa.click.sendDatasIndex($event.currentTarget);
      } catch (e) {}
    },
    getPhoneNumber() {
      api
        .getPhoneNumber()
        .then(res => {
          if (res.data.responseCode === "0000") {
            this.phoneNum = res.data.bankMobile;
          } else if (res.data.responseCode === "7401") {
            this.$pageLoadingBox.show({
              type: "alertBox",
              msg: "查询无果",
              confirmBtn: "知道了",
              confirmCallback: function() {}
            });
          } else if (res.data.responseCode === "9999") {
            this.$pageLoadingBox.show({
              type: "alertBox",
              msg: "服务器开小差啦！请稍后在试",
              confirmBtn: "知道了",
              confirmCallback: function() {}
            });
          } else {
          }
        })
        .catch(err => {});
    },
    reSend() {
      //再次发送短信请求
      let params = window.identityParams;
      api.reSend(params)
        .then(res => {
          if (res.data.responseCode === "0000") {
          } else {
            this.$pageLoadingBox.show({
              type: "alertBox",
              msg: res.responseMessage,
              confirmBtn: "确认",
              closeCallback: function() {},
              confirmCallback: function() {}
            });
          }
        })
        .catch(err => {});
      this.countdown();
    },
    /**
     *倒计时动画
     */
    countdown() {
      if (this.timer) {
        clearInterval(this.timer);
        this.count = 60;
      }
      this.count -= 1;
      this.timer = setInterval(() => {
        if (this.count < 1) {
          clearInterval(this.timer);
          this.count = 60;
          return;
        }
        this.count--;
      }, 1000);
    },

    go() {
      if (this.clicked) {
        return;
      }
      var pcToken = utils.getCookie("pcToken");
      var pcToken2 = utils.getCookie("pcToken2");
      this.clicked = true;
      this.isShowKeyboard = false;
      this.instance.hide();
      this.$pageLoadingBox.show();
      let params = {
        pcToken: pcToken,
        pcToken2: pcToken2, //pcToken2
        phoneCode: this.yzm,
        dfpToken: this.dfpToken //this.dfpToken
      };
      api
        .submitQuickSign(params)
        .then(res => {
          this.$pageLoadingBox.hide();
          if (res.data.responseCode === "H313") {
            if (res.data.skipPayPwdPage == "0") {
              window.location.href = successPageUrl;
            } else {
              this.$router.push({ name: "newRealName-setPassword" });
            }
          } else if (res.data.responseCode === "H314") {
            if (res.data.skipPayPwdPage == "0") {
              window.location.href = successPageUrl;
            } else {
              this.$router.push({ name: "newRealName-setPassword" });
            }
          } else if (res.data.responseCode === "H315") {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "确认",
              confirmCallback: () => {
                this.yzm = "";
                this.$router.push({ name: "newRealName-identity" });
              }
            });
          } else if (res.data.responseCode === "H316") {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "确认",
              confirmCallback: () => {
                this.yzm = "";
                this.$router.push({ name: "newRealName-identity" });
              }
            });
          } else if (res.data.responseCode === "H317") {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "立即前往",
              closeBtn: "取消",
              closeCallback: function() {},
              confirmCallback: () => {
                this.yzm = "";
                this.$router.push({ name: "newRealName-uploadPage" });
                utils.buryingName(document.getElementById("goUpload"));
              }
            });
          } else if (res.data.responseCode === "H318") {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "确认",
              confirmCallback: () => {
                this.clicked = false;
                this.yzm = "";
                this.isShowKeyboard = true;
                this.instance.show();
              }
            });
          } else {
            this.$toastAlertBox.show({
              type: "alertBox",
              msg: res.data.responseMsg,
              confirmBtn: "确认",
              confirmCallback: () => {
                this.yzm = "";
                this.isShowKeyboard = true;
                this.$router.push({ name: "newRealName-identity" });
              }
            });
          }
        })
        .catch(err => {
          this.$pageLoadingBox.hide();
          this.showToast();
          this.clicked = false;
        });
    },
    /**
     * 清除输入框
     */
    clearInput(e) {
      this.yzm = "";
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
          this.yzm = this.yzm.substring(0, this.yzm.length - 1);
        },
        callbackFn: (val, e) => {
          if (this.yzm.length >= 6) {
            return;
          }
          this.yzm += val;
        },
        afterEnterFn: o => {}
      });
      this.instance = instance;
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
      showClearIcon: true, //显示清空图标
      isShowKeyboard: false,
      yzm: "",
      errMessage: "",
      dfpToken: "",
      phoneNum: "",
      count: 60,
      timer: null,
      clicked: false,
      isYzmModalShow: false
    };
  }
};
</script>

<style lang="scss"  scoped>
@import "~/assets/css/_function.scss";
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
.input-row {
  position: relative;
  height: 0.44rem;
  line-height: 0.44rem;
  background-color: #ffffff;
  font-size: 0;
  // border-bottom: 1px solid rgba(225, 225, 225, 0.5);
  padding-left: 0.16rem;
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
  left: 1.6rem;
  width: 0.3rem;
  height: 0.44rem;
  top: 0;
  text-align: center;
  vertical-align: middle;
}

.reSend {
  position: absolute;
  right: 0.16rem;
  top: 0;
  text-align: center;
  vertical-align: middle;
  font-size: 0.12rem;
  color: #247cf0;
  letter-spacing: 0;
  line-height: 0.44rem;
  height: 0.44rem;
}
.countdown {
  position: absolute;
  right: 0.16rem;
  top: 0;
  text-align: center;
  vertical-align: middle;
  font-size: 0.12rem;
  color: #cacaca;
  letter-spacing: 0;
  line-height: 0.43rem;
  height: 0.43rem;
}
.not-receive {
  a {
    color: #247cf0;
  }
  font-size: 0.12rem;
  color: #247cf0;
  letter-spacing: 0;
  line-height: 0.44rem;
  text-align: right;
  padding-right: 0.16rem;
}
.tips {
  font-size: 0.13rem;
  color: #999999;
  text-align: center;
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
.phone-num {
  font-size: 0.24rem;
  color: #000000;
  text-align: left;
  line-height: 0.24rem;
  text-align: center;
  margin-bottom: 0.4rem;
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
