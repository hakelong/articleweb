<template>
    <div v-if='isShow'>
        <div class='xmodal-wrapper-mask'>
            <div class='xmodal-box'>
                <div class='xmodal-msg-box'>
                    <!-- <div class='xmodal-msg-title'>
                        收不到验证码？
                    </div> -->
                    <div class='xmodal-msg-content'>
                        <p>如该身份信息不是您本人，您可以申请变更身份信息。</p>
                    </div>
                </div>
                <div class='xmodal-btn'>
                    <p class='btn-item' @click='close1($event)'>变更身份信息</p>
                    <p class='btn-item' @click='close'>取消</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["value"],
  filters: {
  },
  methods: {
    close() {
      this.isShow = false;
      this.$emit("input", this.isShow);
    },
    close1(event){
      this.isShow = false;
      this.$emit("input", this.isShow);
      this.$emit('modalClose',event)
    }
  },
  watch: {
    value: function(val, old) {
      // console.log('old>>>'+old)
      // console.log('val>>>'+val)
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
    padding:0.2rem 0.25rem 0.2rem;
    border-bottom: 1px solid #e3e3e3;
    .xmodal-msg-title {
      font-size: 0.17rem;
      color: #333333;
      line-height: 0.24rem;
      font-weight: bold;
      padding-bottom: 0.1rem;
    }
    .xmodal-msg-content {
      line-height: 0.22rem;
      font-size: 0.17rem;
      color: #333333;
      text-align: center;
      p {
        margin: 0.05rem 0;
      }
    }
  }
  .xmodal-btn {
    text-align: center;
    display: flex;
    .btn-item {
      font-size: 0.17rem;
      color: #247cf0;
      text-align: center;
      line-height: 0.44rem;
      height: 0.44rem;
      flex: 1 0 0;
      &:first-child{border-right: 1px solid #e3e3e3;}
      // padding: 0.15rem 0;
    }
  }
}
</style>


