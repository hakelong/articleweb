<template>
  <div class="block-btn" @click="go" v-if="!isDisabled">
    <slot></slot>
  </div>
  <div class="block-btn disabled" v-else>
    <slot></slot>
  </div>
</template>

<script type="text/babel">
export default {
  name: "App",
  props: ["btnTxt", "isDisabled", "index"],
  data() {
    return {
      countDown: {},
      timer: null
    };
  },
  components: {},
  created() {},
  mounted() {
    setTimeout(() => {
      if (this.index != undefined) {
        this.countDown = bus.index.countDownArr[this.index];
        //this.startDown();
        this.timer = setInterval(() => {
          this.startDown();
        }, 1000);
      }
    }, 0);
  },
  methods: {
    go($event) {
      this.$emit("tapEvent",$event);
    },
    startDown() {
      if (Number(this.countDown.sec) > 0) {
        this.countDown.sec = (Number(this.countDown.sec) - 1).toString();
        this.countDown.sec.length > 1
          ? ""
          : (this.countDown.sec = "0" + this.countDown.sec);
      } else if (Number(this.countDown.min) > 0) {
        this.countDown.min = (Number(this.countDown.min) - 1).toString();
        this.countDown.min.length > 1
          ? ""
          : (this.countDown.min = "0" + this.countDown.min);
      } else if (Number(this.countDown.hour) > 0) {
        this.countDown.hour = (Number(this.countDown.hour) - 1).toString();
        this.countDown.hour.length > 1
          ? ""
          : (this.countDown.hour = "0" + this.countDown.hour);
      } else {
        this.isDisabled = false;
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import "~/assets/css/_function.scss";
.block-btn {
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  width: pxrem(280px);
  height: pxrem(44px);
  line-height: pxrem(44px);
  text-align: center;
  color: #ffffff;
  background-image: linear-gradient(-90deg, #247CF0 0%, #2261E0 100%);
  font-size: pxrem(17px);
  border-radius: pxrem(4px);
  margin: 0 auto;
  img {
    display: block;
    height: pxrem(22px);
    margin-right: pxrem(6px);
    margin-top: -0.02rem;
  }
}
.disable {
  background-image: linear-gradient(-90deg, #247CF0 0%, #2261E0 100%);
}
.disabled {
  opacity: 0.3;
  background-image: linear-gradient(-90deg, #247cf0 0%, #2261e0 100%);
}
</style>
