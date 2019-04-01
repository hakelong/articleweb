<template>
  <div class="index">
    <topBar>设置支付密码</topBar>
    <div class="title">支付密码</div>
    <div class="pwd-box" v-tap="{fn:showKeyboard1}">
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===0&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=1">
          <span v-if="!showPwd[0].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(0,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===1&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=2">
          <span v-if="!showPwd[1].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(1,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===2&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=3">
          <span v-if="!showPwd[2].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(2,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===3&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=4">
          <span v-if="!showPwd[3].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(3,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===4&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=5">
          <span v-if="!showPwd[4].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(4,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.pwd.length===5&&this.isShowKeyboard1" class="cursor-frame"></em>
        <template v-if="this.pwd.length>=6">
          <span v-if="!showPwd[5].show" class="point">*</span>
          <span v-else>{{this.pwd.substr(5,1)}}</span>
        </template>
      </div>
    </div>
    <div class="tips">密码不能为连续、重复数字</div>
    <div class="title">再次输入</div>
    <div class="pwd-box" v-tap="{fn:showKeyboard2}">
      <div class="pay-pwd-unit">
        <em
          v-if="this.repwd.length===0&&this.isShowKeyboard2||this.pwd.length===6&&this.isShowKeyboard1"
          class="cursor-frame"
        ></em>
        <template v-if="this.repwd.length>=1">
          <span v-if="!showRePwd[0].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(0,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.repwd.length===1&&this.isShowKeyboard2" class="cursor-frame"></em>
        <template v-if="this.repwd.length>=2">
          <span v-if="!showRePwd[1].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(1,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.repwd.length===2&&this.isShowKeyboard2" class="cursor-frame"></em>
        <template v-if="this.repwd.length>=3">
          <span v-if="!showRePwd[2].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(2,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.repwd.length===3&&this.isShowKeyboard2" class="cursor-frame"></em>
        <template v-if="this.repwd.length>=4">
          <span v-if="!showRePwd[3].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(3,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.repwd.length===4&&this.isShowKeyboard2" class="cursor-frame"></em>
        <template v-if="this.repwd.length>=5">
          <span v-if="!showRePwd[4].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(4,1)}}</span>
        </template>
      </div>
      <div class="pay-pwd-unit">
        <em v-if="this.repwd.length===5&&this.isShowKeyboard2" class="cursor-frame"></em>
        <template v-if="this.repwd.length>=6">
          <span v-if="!showRePwd[5].show" class="point">*</span>
          <span v-else>{{this.repwd.substr(5,1)}}</span>
        </template>
      </div>
    </div>
    <div class="heightDiv"></div>

    <Button :isDisabled="isDisabled" style="width:3.43rem" @tapEvent="submit">确认提交</Button>
  </div>
</template>
<script>
import Keyboard from "~/components/keyboard2/keyboard.js";
import Button from "~/components/button";
import md5 from "js-md5";
import api from "~/api/api";
import {hrefUrls} from "~/api/urls";
export default {
  name: "index",
  components: {
    Button
  },
  computed: {
    isDisabled() {
      return !((this.pwd.length === 6) & (this.repwd.length === 6));
    }
  },
  filters: {
    formatPwd(val, arg1) {
      if (!val) {
        return "";
      }
      return val.substr(arg1, 1);
    }
  },
  created() {},
  mounted: function() {
    this.$bus.photoPwd = this;
    this.initKeyboard();
  },
  activated() {
    this.pwd = "";
    this.repwd = "";
  },
  deactivated() {
    this.instance.hide();
  },
  methods: {
    /**
     * 校验连续和重复
     */
    validatePassword() {
      let reg = /(\w)*(\w)\2{1}(\w)*/g;
      let err = "";
      if (reg.test(this.pwd)) {
        err = "密码不能为重复数字";
      } else {
        err = "密码不能为连续数字";
        for (let i = 1; i < this.pwd.length; i++) {
          let x = parseInt(this.pwd.charAt(i));
          if (
            parseInt(this.pwd.charAt(i)) !==
            parseInt(this.pwd.charAt(i - 1)) + 1
          ) {
            err = "";
            break;
          }
        }
      }
      return err;
    },
    /**
     * 点击按钮
     */
    submit() {
      this.isShowKeyboard1 = false;
      this.isShowKeyboard2 = false;
      this.instance.hide();
      if (this.pwd === this.repwd) {
        let str = this.validatePassword();
        if (!str) {
          this.$pageLoadingBox.show();
          let params = {
            password: md5(this.pwd),
            browser: {
              browserName: window.browserInfo.appname,
              browserVersion: window.browserInfo.version
            },
            pcToken: window.pcToken,
            pcToken2: window.pcToken2
          };
          api
            .submitSimplePassword(params)
            .then(res => {
              this.$pageLoadingBox.hide();
              if (res.data.responseCode === "0000") {
                this.$router.push({ name: "newRealName-success" });
              } else if (res.data.responseCode === "A712") {
                this.$toastAlertBox.show({
                  type: "alertBox",
                  msg: res.data.responseMsg,
                  confirmBtn: "确认",
                  confirmCallback: () => {
                    window.location.href = hrefUrls.uploadCheckUrl;
                  }
                });
              } else {
                this.$toastAlertBox.show({
                  type: "alertBox",
                  msg: res.data.responseMsg,
                  confirmBtn: "确认",
                  confirmCallback: () => {
                    this.$router.push({ name: "newRealName-uploadPage" });
                  }
                });
              }
            })
            .catch(err => {
              this.$pageLoadingBox.hide();
              this.showToast();
            });
        } else {
          this.$toastAlertBox.show({
            type: "alertBox",
            msg: str,
            confirmBtn: "确认",
            closeCallback: () => {},
            confirmCallback: () => {
              this.pwd = "";
              this.repwd = "";
            }
          });
        }
      } else {
        this.$toastAlertBox.show({
          type: "alertBox",
          msg: "两次支付密码输入不一致,<br>请重新输入",
          confirmBtn: "确认",
          closeCallback: () => {},
          confirmCallback: () => {
            this.pwd = "";
            this.repwd = "";
          }
        });
      }
    },

    go() {
      this.instance.hide();
      this.$router.push({ name: "identity" });
    },
    /**
     * 清除输入框
     */
    clearInput(e) {
      this.yzm = "";
    },
    showKeyboard1() {
      this.instance.show();
      this.isShowKeyboard1 = true;
      this.isShowKeyboard2 = false;
    },
    showKeyboard2() {
      this.instance.show();
      this.isShowKeyboard2 = true;
      this.isShowKeyboard1 = false;
    },
    initKeyboard() {
      let instance = new Keyboard({
        keyboardType: "simple-num",
        position: "fixed",
        completeFn: _this => {
          this.isShowKeyboard1 = false;
          this.isShowKeyboard2 = false;
        },
        deleteFn: _this => {
          if (this.isShowKeyboard1) {
            this.pwd = this.pwd.substr(0, this.pwd.length - 1);
          } else if (this.isShowKeyboard2) {
            this.repwd = this.repwd.substr(0, this.repwd.length - 1);
          }
        },
        callbackFn: (val, e) => {
          if (this.isShowKeyboard1) {
            if (this.pwd.length > 5) {
              this.isShowKeyboard1 = false;
              this.isShowKeyboard2 = true;
              this.repwd += val;
              let index = this.repwd.length - 1;
              this.showRePwd[index].show = true;
              setTimeout(() => {
                this.showRePwd[index].show = false;
              }, 500);
              return;
            }
            this.pwd += val;
            let index = this.pwd.length - 1;
            this.showPwd[index].show = true;
            setTimeout(() => {
              this.showPwd[index].show = false;
            }, 500);
          } else if (this.isShowKeyboard2) {
            if (this.repwd.length > 5) {
              return;
            }
            if (this.pwd.length === 6) {
              this.repwd += val;
              let index = this.repwd.length - 1;
              this.showRePwd[index].show = true;
              setTimeout(() => {
                this.showRePwd[index].show = false;
              }, 500);
            }
          }
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
        msg: val || "网络繁忙，请稍后再试"
      });
    }
  },
  data() {
    return {
      isShowKeyboard1: false,
      isShowKeyboard2: false,
      pwd: "",
      repwd: "",
      showPwd: [
        { show: true },
        { show: true },
        { show: true },
        { show: true },
        { show: true },
        { show: true }
      ],
      showRePwd: [
        { show: true },
        { show: true },
        { show: true },
        { show: true },
        { show: true },
        { show: true }
      ]
    };
  }
};
</script>

<style lang="scss"  scoped>
@import "~assets/css/_function";
.heightDiv {
  height: 30px;
}
.index {
  // position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.title {
  padding-left: 0.16rem;
  font-size: 0.14rem;
  color: #333333;
  padding-top: 0.24rem;
}
.pwd-box {
  padding-left: 0.16rem;
  overflow: hidden;
}
.pay-pwd-unit {
  position: relative;
  float: left;
  margin-left: 0.07rem;
  margin-top: 0.05rem;
  width: 0.47rem;
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.16rem;
  white-space: nowrap;
  border: 1px solid #c3c3c3;
  text-align: center;
  border-radius: 0.02rem;
  &:first-child {
    margin-left: 0;
  }
}
.cursor-frame {
  position: relative;
  border-right: 3px solid;
  -moz-border-radius: 0.01rem;
  -webkit-border-radius: 0.01rem;
  border-radius: 0.01rem;
  height: 0.35rem;
  color: #3266d5;
  background-color: #3266d5;
  -webkit-animation: cursorAni 1s infinite linear;
  animation: cursorAni 1s infinite linear;
  z-index: 9999;
  vertical-align: top;
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
.tips {
  font-size: 0.12rem;
  color: #999999;
  line-height: 0.12rem;
  padding-top: 0.1rem;
  padding-left: 0.16rem;
}
.service-agreement {
  padding: 0.1rem 0 0.1rem 0.16rem;
  color: #999999;
}
.label-box {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: url(~assets/img/icon_checked@3x.png) no-repeat center;
  background-size: 0.12rem 0.12rem;
  vertical-align: text-top;
}
.point {
  display: inline-block;
  // width: 0.16rem;
  // height: 0.16rem;
  // border-radius: 0.08rem;
  // background: #000;
  // margin-top:0.13rem;
  font-size: 0.35rem;
  line-height: 0.44rem;
  position: relative;
  top: 0.08rem;
}
</style>
