<template>
    <div v-if='isShow'>
        <div class='xmodal-wrapper-mask'>
            <div class='xmodal-box'>
                <div class='xmodal-msg-box'>
                    <div class='xmodal-msg-title'>
                        收不到验证码？
                    </div>
                    <div class='xmodal-msg-content'>
                        <p>1、请确认{{phoneNum|hidePhone}}与银行预留手机号是否一致</p>
                        <p>2、请检查短信是否被手机安全软件拦截</p>
                        <p>3、若预留手机号已停用，建议换一张卡绑定，或联系银行客服咨询</p>
                        <p>4、由于运营商网络问题，可能存在延迟，请耐心等待或重新获取</p>
                        <p>5、获得更多帮助，请联金融客服</p>
                    </div>
                </div>
                <div class='xmodal-btn'>
                    <p class='btn-item' @click='close'>知道了</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["value", "phoneNum"],
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
  methods: {
    close() {
      this.isShow = false;
      this.$emit("input", this.isShow);
    }
  },
  watch: {
    value: function(val, old) {
      this.isShow = val;
    }
  },
  data() {
    return {
      isShow: this.value
    };
  }
};
</script>
<style scoped lang='scss'>
.xmodal-wrapper-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  max-width: 750px;
  top: 0;
  z-index: 99999;
}
.xmodal-box {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translateX(-50%) translateY(-50%);
  width: 2.8rem;
  background: #fff;
  border-radius: 0.12rem;
  .xmodal-msg-box {
    padding: 0.25rem;
    padding-top: 0.2rem;
    border-bottom: 1px solid #e3e3e3;
    .xmodal-msg-title {
      font-size: 0.17rem;
      color: #333333;
      line-height: 0.24rem;
      font-weight: bold;
      padding-bottom: 0.1rem;
    }
    .xmodal-msg-content {
      font-size: 0.14rem;
      color: #333333;
      line-height: 0.19rem;
      p {
        margin: 0.05rem 0;
      }
    }
  }
  .xmodal-btn {
    text-align: center;
    padding: 0.15rem 0;
    .btn-item {
      font-size: 0.17rem;
      color: #247cf0;
      text-align: center;
      line-height: 0.17rem;
      height: 0.17rem;
    }
  }
}
</style>


